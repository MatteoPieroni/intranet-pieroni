import { OAuth2Client } from 'google-auth-library';
import { google, mybusinessbusinessinformation_v1 } from 'googleapis';
import { subMonths } from 'date-fns/subMonths';

export type Location = mybusinessbusinessinformation_v1.Schema$Location & {
  name: string;
  storefrontAddress: {
    locality: string;
  };
  regularHours: {
    periods: mybusinessbusinessinformation_v1.Schema$TimePeriod;
  };
  specialHours: {
    specialHourPeriods: mybusinessbusinessinformation_v1.Schema$SpecialHourPeriod;
  };
  metadata: {
    mapsUri: string;
  };
};

export type DbSpecialHourPeriod =
  mybusinessbusinessinformation_v1.Schema$SpecialHourPeriod;

const checkLocationData = (
  location: mybusinessbusinessinformation_v1.Schema$Location
): location is Location => {
  if (!location.name) {
    return false;
  }

  if (!location.storefrontAddress?.locality) {
    return false;
  }

  if (!location.regularHours?.periods) {
    return false;
  }

  if (!location.specialHours?.specialHourPeriods) {
    return false;
  }

  if (!location.metadata?.mapsUri) {
    return false;
  }

  return true;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PERFORMANCE_METRICS = [
  'BUSINESS_IMPRESSIONS_DESKTOP_MAPS',
  'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH',
  'BUSINESS_IMPRESSIONS_MOBILE_MAPS',
  'BUSINESS_IMPRESSIONS_MOBILE_SEARCH',
] as const;

const getGoogleDate = (date: Date) => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
});

const addArray = (a: number[]) =>
  a.reduce((total, current) => total + current, 0);

class GoogleApisClient {
  authClient: OAuth2Client;
  accessToken: string | undefined;
  accountName: string | undefined;

  constructor() {
    this.authClient = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      `${process.env.BASE_URL}/oauth2callback`
    );

    google.options({ auth: this.authClient });
  }

  getAuthorizeUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/plus.business.manage',
    ];

    return this.authClient.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',

      // If you only need one scope, you can pass it as a string
      scope: scopes,
    });
  }

  async setTokens(token: string) {
    this.authClient.setCredentials({
      refresh_token: token,
    });

    try {
      const accessToken = await this.authClient.getAccessToken();

      if (!accessToken.token) {
        throw new Error('Could not get access token');
      }

      this.authClient.setCredentials({
        access_token: accessToken.token,
      });
      this.accessToken = accessToken.token;
    } catch (e) {
      if (e instanceof Error && 'status' in e && e.status === 400) {
        throw new Error('REVOKED');
      }

      throw e;
    }
  }

  async getAccount() {
    if (this.accountName) {
      return this.accountName;
    }

    const accounts = (
      await google.mybusinessaccountmanagement('v1').accounts.list()
    ).data.accounts;
    const group = accounts?.find(
      (account) =>
        account.accountNumber === process.env.GMB_LOCATION_GROUP_NUMBER
    );

    if (!group?.name) {
      throw new Error('NO_GROUP_ACCOUNT');
    }

    this.accountName = group.name;
    return group.name;
  }

  async getLocations() {
    const accountName = await this.getAccount();

    const ownedLocations = await google
      .mybusinessbusinessinformation('v1')
      .accounts.locations.list({
        parent: accountName,
        readMask:
          'name,title,storefrontAddress,regularHours,specialHours,metadata',
        orderBy: 'storeCode',
      });

    const locationData = ownedLocations.data.locations;

    if (!locationData) {
      throw new Error('NO_LOCATIONS');
    }

    const locationDataFiltered = locationData.filter(checkLocationData);

    if (locationDataFiltered.length === 0) {
      throw new Error('NO_DATA');
    }

    return locationDataFiltered;
  }

  async patchLocation(name: string, data: DbSpecialHourPeriod[]) {
    return await google.mybusinessbusinessinformation('v1').locations.patch({
      name,
      updateMask: 'specialHours',
      // validateOnly: true,
      requestBody: {
        specialHours: {
          specialHourPeriods: data,
        },
      },
    });
  }

  async getReviewRating(names: string[]) {
    const accountName = await this.getAccount();

    try {
      const locationReviewsPromises = names.map((name) =>
        fetch(
          `https://mybusiness.googleapis.com/v4/${accountName}/${name}/reviews?pageSize=1`,
          {
            headers: [['Authorization', `Bearer ${this.accessToken}`]],
          }
        )
      );

      const locationReviewsResponse = await Promise.all(
        locationReviewsPromises
      );

      const locationReviews = await Promise.all(
        locationReviewsResponse.map(async (response) => await response.json())
      );

      return locationReviews.map((location, index) => ({
        id: names[index],
        averageRating: Number(Number(location.averageRating).toFixed(1)),
        number: Number(location.totalReviewCount),
        reviews: location.reviews,
      }));
    } catch (e) {
      throw e;
    }
  }

  async getPagePerformance(names: string[]) {
    const today = getGoogleDate(new Date());
    const aMonthAgo = getGoogleDate(subMonths(new Date(), 1));

    const getImpressions = async (
      name: string,
      metricsArray: (typeof PERFORMANCE_METRICS)[number][]
    ) => {
      const impressionsRequests = await Promise.all(
        metricsArray.map((metric) =>
          google
            .businessprofileperformance('v1')
            .locations.getDailyMetricsTimeSeries({
              name,
              dailyMetric: metric,
              'dailyRange.endDate.day': today.day,
              'dailyRange.endDate.month': today.month,
              'dailyRange.endDate.year': today.year,
              'dailyRange.startDate.day': aMonthAgo.day,
              'dailyRange.startDate.month': aMonthAgo.month,
              'dailyRange.startDate.year': aMonthAgo.year,
            })
        )
      );

      const allNumbers = impressionsRequests
        .map(
          (metric) =>
            metric.data.timeSeries?.datedValues?.map((value) =>
              Number(value.value || 0)
            ) || []
        )
        .flat();

      if (!allNumbers) {
        return 0;
      }

      return addArray(allNumbers);
    };

    const dataPromises = names.map(async (name) => {
      const searchImpressions = await getImpressions(name, [
        'BUSINESS_IMPRESSIONS_MOBILE_SEARCH',
        'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH',
      ]);
      const mapsImpressions = await getImpressions(name, [
        'BUSINESS_IMPRESSIONS_MOBILE_MAPS',
        'BUSINESS_IMPRESSIONS_DESKTOP_MAPS',
      ]);

      return {
        name,
        search: searchImpressions,
        maps: mapsImpressions,
      };
    });

    const data = await Promise.all(dataPromises);

    return data;
  }
}

export const googleClient = new GoogleApisClient();
