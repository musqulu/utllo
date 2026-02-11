import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  tools as allTools,
  getToolsByCategory,
  getToolByCategoryAndSlug,
  getCategoryBySlug,
  getCategorySlug,
  getToolSlug,
  getToolUrl,
  getRelatedTools,
  allCategoryIds,
} from "@/lib/tools";
import { JsonLd, generateWebApplicationSchema, generateBreadcrumbSchema } from "@/components/seo/json-ld";
import { renderToolComponent } from "@/lib/tool-renderers";
import { SeoContent, type SeoBlock } from "@/components/seo/seo-content";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://utllo.com";

interface PageProps {
  params: Promise<{ locale: Locale; category: string; tool: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; category: string; tool: string }[] = [];

  for (const locale of i18n.locales) {
    for (const tool of allTools) {
      params.push({
        locale,
        category: getCategorySlug(tool.category, locale),
        tool: getToolSlug(tool, locale),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category: categorySlug, tool: toolSlug } = await params;
  const tool = getToolByCategoryAndSlug(categorySlug, toolSlug, locale);

  if (!tool) return { title: "Not Found" };

  const dict = await getDictionary(locale);
  const toolDict = dict.tools[tool.id as keyof typeof dict.tools];

  // Build hreflang alternates
  const languages: Record<string, string> = {};
  for (const loc of i18n.locales) {
    languages[loc] = `${BASE_URL}${getToolUrl(tool, loc)}`;
  }

  return {
    title: toolDict?.seoTitle || tool.id,
    description: toolDict?.seoDescription || "",
    alternates: {
      canonical: `${BASE_URL}${getToolUrl(tool, locale)}`,
      languages,
    },
    openGraph: {
      title: toolDict?.seoTitle || tool.id,
      description: toolDict?.seoDescription || "",
      url: `${BASE_URL}${getToolUrl(tool, locale)}`,
      siteName: dict.brand,
      locale: locale === "pl" ? "pl_PL" : "en_US",
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { locale, category: categorySlug, tool: toolSlug } = await params;
  const categoryId = getCategoryBySlug(categorySlug, locale);
  const tool = getToolByCategoryAndSlug(categorySlug, toolSlug, locale);

  if (!tool || !categoryId) notFound();

  const dict = await getDictionary(locale);
  const toolDict = dict.tools[tool.id as keyof typeof dict.tools] as any;
  const categoryPage = dict.categoryPages[categoryId];
  const relatedTools = getRelatedTools(tool.id, 3);
  const catSlug = getCategorySlug(categoryId, locale);

  const webAppSchema = generateWebApplicationSchema({
    name: toolDict?.seoTitle || tool.id,
    description: toolDict?.seoDescription || "",
    url: `${BASE_URL}${getToolUrl(tool, locale)}`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.categoryPages.breadcrumbs.home, url: `${BASE_URL}/${locale}` },
    { name: categoryPage.title, url: `${BASE_URL}/${locale}/${catSlug}` },
    { name: toolDict?.name || tool.id, url: `${BASE_URL}${getToolUrl(tool, locale)}` },
  ]);

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-muted-foreground max-w-2xl mx-auto">
          <ol className="flex items-center gap-2">
            <li>
              <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
                {dict.categoryPages.breadcrumbs.home}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/${locale}/${catSlug}`} className="hover:text-foreground transition-colors">
                {categoryPage.title}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">{toolDict?.name || tool.id}</li>
          </ol>
        </nav>

        {/* Tool Component */}
        <div className="max-w-2xl mx-auto">
          {renderToolComponent(tool.id, tool.isReady, toolDict, {
            copy: dict.common.copy,
            copied: dict.common.copied,
          }, locale)}
        </div>

        {/* SEO Content */}
        {toolDict?.seoContent && (
          <SeoContent blocks={toolDict.seoContent as SeoBlock[]} />
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="max-w-2xl mx-auto mt-16">
            <h3 className="text-lg font-semibold mb-4 text-center">
              {dict.categoryPages.relatedTools}
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedTools.map((relTool) => {
                const relToolDict = dict.tools[relTool.id as keyof typeof dict.tools];
                const Icon = relTool.icon;
                return (
                  <Link
                    key={relTool.id}
                    href={getToolUrl(relTool, locale)}
                    className="p-4 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all text-center"
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <span className="text-sm font-medium">{relToolDict?.name || relTool.id}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
