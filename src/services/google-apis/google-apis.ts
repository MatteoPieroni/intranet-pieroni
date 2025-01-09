import { OAuth2Client } from 'google-auth-library';
import { google, mybusinessbusinessinformation_v1 } from 'googleapis';

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
      (account) => account.accountNumber === '5593184580'
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
}

export const googleClient = new GoogleApisClient();
