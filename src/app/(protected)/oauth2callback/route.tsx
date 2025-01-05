import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { googleClient } from '@/services/google-apis';
import { pushGoogleAuthOnServer, getUser } from '@/services/firebase/server';

export async function GET(request: NextRequest) {
  const currentHeaders = await headers();

  const user = await getUser(currentHeaders);
  if (!user.currentUser?.isAdmin) {
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

  pushGoogleAuthOnServer(currentHeaders, {
    refresh_token,
  });

  return redirect('/admin-google');
}
