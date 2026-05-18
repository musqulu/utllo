import { i18n, Locale, getLocalePath } from "@/lib/i18n/config";

/** BCP 47-style keys for Next.js `alternates.languages` / sitemap */
export const HREFLANG_PL = "pl-PL";
export const HREFLANG_EN = "en";

const localeToHreflang: Record<string, string> = {
  pl: HREFLANG_PL,
  en: HREFLANG_EN,
};

/**
 * Build hreflang map for Polish (root) + English (/en), with x-default → /en
 * so Google has a fallback for non-PL/EN audiences.
 */
export function buildHreflangAlternates(
  baseUrl: string,
  getPathForLocale: (locale: Locale) => string
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const loc of i18n.locales) {
    const key = localeToHreflang[loc] ?? loc;
    languages[key] = `${baseUrl}${getPathForLocale(loc as Locale)}`;
  }
  languages["x-default"] = `${baseUrl}${getPathForLocale("en" as Locale)}`;
  return languages;
}

/** Home: PL at origin, EN at /en */
export function homeHreflangAlternates(baseUrl: string): Record<string, string> {
  return buildHreflangAlternates(baseUrl, (loc) => getLocalePath(loc) || "/");
}
