import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth0 } from './lib/auth0';

export async function middleware(request: NextRequest) {
  // Run Auth0 middleware (sets up session handling)
  const response = await auth0.middleware(request);

  const session = await auth0.getSession(request);

  console.log('session', session);

  // If the user is logged in and visiting '/', redirect to '/todos'
  if (request.nextUrl.pathname === '/' && session) {
    return NextResponse.redirect(new URL('/todos', request.url));
  } else if (
    request.nextUrl.pathname !== '/'
    && !request.nextUrl.pathname.startsWith('/auth')
    && !session
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    // Add custom exclusions as needed
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

