import { MetadataRoute } from "next";
import { i18n, getLocalePath } from "@/lib/i18n/config";
import { buildHreflangAlternates, homeHreflangAlternates } from "@/lib/i18n/hreflang";
import { tools, allCategoryIds, getToolUrl, getCategoryUrl } from "@/lib/tools";
import { STATIC_PAGES, getStaticPagePath } from "@/lib/i18n/static-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://utllo.com";

  const routes: MetadataRoute.Sitemap = [];

  // ---------------------------------------------------------------
  // Home pages — one entry per locale.
  // Polish uses root (/), English uses /en.
  // No /pl/ prefix must appear anywhere in the sitemap.
  // ---------------------------------------------------------------
  for (const locale of i18n.locales) {
    const localePath = getLocalePath(locale);
    const url = localePath ? `${baseUrl}${localePath}` : baseUrl;

    const alternates = homeHreflangAlternates(baseUrl);

    routes.push({
      url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: alternates },
    });
  }

  // ---------------------------------------------------------------
  // Category pages
  // ---------------------------------------------------------------
  for (const locale of i18n.locales) {
    for (const categoryId of allCategoryIds) {
      const categoryPath = getCategoryUrl(categoryId, locale);

      const alternates = buildHreflangAlternates(baseUrl, (loc) =>
        getCategoryUrl(categoryId, loc)
      );

      routes.push({
        url: `${baseUrl}${categoryPath}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: { languages: alternates },
      });
    }
  }

  // ---------------------------------------------------------------
  // Tool pages
  // ---------------------------------------------------------------
  for (const locale of i18n.locales) {
    for (const tool of tools) {
      const toolPath = getToolUrl(tool, locale);

      const alternates = buildHreflangAlternates(baseUrl, (loc) =>
        getToolUrl(tool, loc)
      );

      routes.push({
        url: `${baseUrl}${toolPath}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: alternates },
      });
    }
  }

  // ---------------------------------------------------------------
  // Static pages (locale-specific slugs: /kontakt vs /en/contact, etc.)
  // ---------------------------------------------------------------
  for (const page of STATIC_PAGES) {
    for (const locale of i18n.locales) {
      const pagePath = getStaticPagePath(page.id, locale);
      const alternates = buildHreflangAlternates(baseUrl, (loc) =>
        getStaticPagePath(page.id, loc)
      );

      routes.push({
        url: `${baseUrl}${pagePath}`,
        lastModified: new Date(),
        changeFrequency: "yearly",
        priority: 0.3,
        alternates: { languages: alternates },
      });
    }
  }

  return routes;
}
