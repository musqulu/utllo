import { MetadataRoute } from "next";
import { i18n } from "@/lib/i18n/config";
import { tools, categoryMeta, allCategoryIds, getToolUrl, getCategoryUrl } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://uttlo.com";

  const routes: MetadataRoute.Sitemap = [];

  for (const locale of i18n.locales) {
    // Add home page
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    });

    // Add category pages
    for (const categoryId of allCategoryIds) {
      routes.push({
        url: `${baseUrl}${getCategoryUrl(categoryId, locale)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }

    // Add tool pages with new URL structure
    for (const tool of tools) {
      routes.push({
        url: `${baseUrl}${getToolUrl(tool, locale)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: tool.isReady ? 0.8 : 0.5,
      });
    }
  }

  return routes;
}
