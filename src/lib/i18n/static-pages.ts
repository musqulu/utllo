import { getLocalePath } from "@/lib/i18n/config";

/** Legal / info pages: Polish URL slugs vs English slugs */
export const STATIC_PAGES = [
  { id: "contact", pl: "kontakt", en: "contact" },
  { id: "about", pl: "o-nas", en: "about" },
  { id: "terms", pl: "regulamin", en: "terms" },
  { id: "privacy", pl: "polityka-prywatnosci", en: "privacy" },
] as const;

export type StaticPageId = (typeof STATIC_PAGES)[number]["id"];

export function getStaticPageSlug(
  pageId: StaticPageId,
  locale: string
): string {
  const row = STATIC_PAGES.find((p) => p.id === pageId);
  if (!row) return "";
  return locale === "en" ? row.en : row.pl;
}

/** Full path e.g. `/kontakt` or `/en/contact` */
export function getStaticPagePath(pageId: StaticPageId, locale: string): string {
  const slug = getStaticPageSlug(pageId, locale);
  return `${getLocalePath(locale)}/${slug}`;
}

/** Map a static slug from one locale to the other (kontakt ↔ contact) */
export function translateStaticPageSlug(
  slug: string,
  fromLocale: string,
  toLocale: string
): string | null {
  if (fromLocale === toLocale) return slug;
  const row = STATIC_PAGES.find((p) => p.pl === slug || p.en === slug);
  if (!row) return null;
  return toLocale === "en" ? row.en : row.pl;
}
