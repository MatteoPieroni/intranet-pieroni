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
};

export type DbSpecialHourPeriod =
  mybusinessbusinessinformation_v1.Schema$SpecialHourPeriod;

const checkLocationData = (
  location: mybusinessbusinessinformation_v1.Schema$Location
): location is Location => {
  if (!location.name) {
    return false;
  }

  if (!location.storefrontAddress || !location.storefrontAddress.locality) {
    return false;
  }

  if (!location.regularHours || !location.regularHours.periods) {
    return false;
  }

  if (!location.specialHours || !location.specialHours.specialHourPeriods) {
    return false;
  }

  return true;
};

class GoogleApisClient {
  authClient: OAuth2Client;
  accessToken: string | undefined;

  constructor() {
    this.authClient = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      'https://localhost:3000/oauth2callback'
    );

    google.options({ auth: this.authClient });
  }

  getAuthorizeUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/plus.business.manage',
    ];

    console.log(
      this.authClient.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        // If you only need one scope, you can pass it as a string
        scope: scopes,
      })
    );

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

  async getLocations() {
    const accounts = (
      await google.mybusinessaccountmanagement('v1').accounts.list()
    ).data.accounts;
    const group = accounts?.find(
      (account) => account.accountNumber === '5593184580'
    );

    if (!group?.name) {
      throw new Error('NO_GROUP_ACCOUNT');
    }

    const ownedLocations = await google
      .mybusinessbusinessinformation('v1')
      .accounts.locations.list({
        parent: group.name,
        readMask: 'name,title,storefrontAddress,regularHours,specialHours',
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
}

export const googleClient = new GoogleApisClient();
