import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "@/lib/i18n/config";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname is missing locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = i18n.defaultLocale;

    // Handle root path specially
    if (pathname === "/") {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    // e.g. incoming request is /generator-hasel
    // The new URL is now /pl/generator-hasel
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
