import { NextResponse, type NextRequest } from 'next/server';
import { LOCALES, pickFromAcceptLanguage } from '@/lib/locales';

// Redirects "/" and any path without a language prefix to /de/... or /en/...,
// based on the browser language (German is the default).
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const lang = pickFromAcceptLanguage(request.headers.get('accept-language'));
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // skip API routes, Next internals and any file with an extension (images, sitemap.xml, ...)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
