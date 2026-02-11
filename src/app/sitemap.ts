import { MetadataRoute } from "next";
import { i18n } from "@/lib/i18n/config";
import { tools, allCategoryIds, getToolUrl, getCategoryUrl } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://utllo.com";

  const routes: MetadataRoute.Sitemap = [];

  // Home pages for each locale
  for (const locale of i18n.locales) {
    const alternates: Record<string, string> = {};
    for (const loc of i18n.locales) {
      alternates[loc] = `${baseUrl}/${loc}`;
    }

    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: alternates },
    });
  }

  // Category pages for each locale
  for (const locale of i18n.locales) {
    for (const categoryId of allCategoryIds) {
      const alternates: Record<string, string> = {};
      for (const loc of i18n.locales) {
        alternates[loc] = `${baseUrl}${getCategoryUrl(categoryId, loc)}`;
      }

      routes.push({
        url: `${baseUrl}${getCategoryUrl(categoryId, locale)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: { languages: alternates },
      });
    }
  }

  // Tool pages for each locale
  for (const locale of i18n.locales) {
    for (const tool of tools) {
      const alternates: Record<string, string> = {};
      for (const loc of i18n.locales) {
        alternates[loc] = `${baseUrl}${getToolUrl(tool, loc)}`;
      }

      routes.push({
        url: `${baseUrl}${getToolUrl(tool, locale)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: tool.isReady ? 0.8 : 0.5,
        alternates: { languages: alternates },
      });
    }
  }

  return routes;
}
