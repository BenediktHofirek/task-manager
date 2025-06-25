import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  appBaseUrl: process.env.APP_BASE_URL,
  secret: process.env.AUTH0_SECRET,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  authorizationParameters: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: process.env.AUTH0_SCOPE,
  }
});

type HandlerWithHeaders<T, R> = (
  payload: T & { headers: Record<string, string> },
) => Promise<R>;

export async function withAuthToken<T extends Record<string,any>, R>(
  handler: HandlerWithHeaders<T, R>,
  payload: T = {} as T,
): Promise<R> {
  const { token: authToken } = await auth0.getAccessToken();

  return handler({
    ...payload,
    headers: {
      ...(payload as any).headers,
      Authorization: `Bearer ${authToken}`,
    },
  }).catch((x) => {console.log('result', x); return x });
}
