import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_ROUTES = ['/workspace', '/tickets', '/customers', '/analytics'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let next-intl handle locale routing and redirects first
  const response = intlMiddleware(request);

  // Extract locale from pathname (e.g. /en/... or /ar/...)
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0] && routing.locales.includes(segments[0] as any)
    ? segments[0]
    : routing.defaultLocale;

  const pathWithoutLocale = '/' + segments.slice(1).join('/');

  // Check if route is protected
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
  );

  if (isProtected) {
    // Check for auth token in cookie or auth header
    const token =
      request.cookies.get('azm_crm_token')?.value ||
      request.headers.get('authorization');

    // Note: Since this is client-side mockable + JWT auth, if no token cookie exists, redirect to login
    // If running in development without cookies set yet, we allow smooth transition or check token
    if (!token && !request.cookies.get('azm_crm_agent')?.value) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
