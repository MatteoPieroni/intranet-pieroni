import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { googleClient } from '@/services/google-apis';
import { pushGoogleAuth, getUser } from '@/services/firebase/server';
import { checkIsAdmin } from '@/services/firebase/server/permissions';

export async function GET(request: NextRequest) {
  const authHeader = (await headers()).get('Authorization');

  const user = await getUser(authHeader);
  if (!checkIsAdmin(user.currentUser?.permissions)) {
    return Response.error();
  }

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (searchParams.get('error') || !code) {
    return redirect('/');
  }

  // This will provide an object with the access_token and refresh_token.
  // Save these somewhere safe so they can be used at a later time.
  const { tokens } = await googleClient.authClient.getToken(code);
  googleClient.authClient.setCredentials(tokens);

  const { refresh_token } = tokens;

  if (!refresh_token) {
    // TODO: make better error
    throw new Error('Only access token');
  }

  pushGoogleAuth(authHeader, {
    refresh_token,
  });

  return redirect('/admin-google');
}
