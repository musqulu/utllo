import { Metadata } from "next";
import Link from "next/link";
import { Zap, Shield, UserX } from "lucide-react";
import { notFound } from "next/navigation";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  getToolsByCategory,
  categoryMeta,
  getToolUrl,
  getCategoryUrl,
  getCategoryBySlug,
  getCategorySlug,
  allCategoryIds,
  ToolCategory,
} from "@/lib/tools";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { JsonLd, generateCollectionPageSchema, generateBreadcrumbSchema } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { SeoContent, type SeoBlock } from "@/components/seo/seo-content";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://utllo.com";

interface PageProps {
  params: Promise<{ locale: Locale; category: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; category: string }[] = [];

  for (const locale of i18n.locales) {
    for (const categoryId of allCategoryIds) {
      params.push({
        locale,
        category: getCategorySlug(categoryId, locale),
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  const categoryId = getCategoryBySlug(categorySlug, locale);

  if (!categoryId) return { title: "Not Found" };

  const dict = await getDictionary(locale);
  const categoryPage = dict.categoryPages[categoryId];
  const catSlug = getCategorySlug(categoryId, locale);

  // Build hreflang alternates
  const languages: Record<string, string> = {};
  for (const loc of i18n.locales) {
    languages[loc] = `${BASE_URL}/${loc}/${getCategorySlug(categoryId, loc)}`;
  }

  return {
    title: categoryPage.seoTitle,
    description: categoryPage.seoDescription,
    keywords: categoryPage.keywords || [],
    alternates: {
      canonical: `${BASE_URL}/${locale}/${catSlug}`,
      languages,
    },
    openGraph: {
      title: categoryPage.seoTitle,
      description: categoryPage.seoDescription,
      url: `${BASE_URL}/${locale}/${catSlug}`,
      siteName: dict.brand,
      locale: locale === "pl" ? "pl_PL" : "en_US",
      type: "website",
    },
  };
}

// Color map for category dots
const CATEGORY_COLORS: Record<ToolCategory, string> = {
  tools: "blue",
  generators: "pink",
  converters: "green",
  randomizers: "orange",
  calculators: "purple",
};

// Other categories to show in "Discover" section (excluding current)
function getOtherCategories(current: ToolCategory): ToolCategory[] {
  const others: ToolCategory[] = ["tools", "generators", "converters", "randomizers", "calculators"];
  return others.filter((c) => c !== current).slice(0, 3);
}

export default async function CategoryPage({ params }: PageProps) {
  const { locale, category: categorySlug } = await params;
  const categoryId = getCategoryBySlug(categorySlug, locale);

  if (!categoryId) notFound();

  const dict = await getDictionary(locale);
  const tools = getToolsByCategory(categoryId);
  const categoryPage = dict.categoryPages[categoryId];
  const catSlug = getCategorySlug(categoryId, locale);

  const readyTools = tools.filter((t) => t.isReady);
  const comingSoonTools = tools.filter((t) => !t.isReady);

  const collectionSchema = generateCollectionPageSchema({
    name: categoryPage.title,
    description: categoryPage.seoDescription,
    url: `${BASE_URL}/${locale}/${catSlug}`,
    items: readyTools.map((tool) => ({
      name: dict.tools[tool.id as keyof typeof dict.tools]?.name || tool.id,
      url: `${BASE_URL}${getToolUrl(tool, locale)}`,
    })),
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.categoryPages.breadcrumbs.home, url: `${BASE_URL}/${locale}` },
    { name: categoryPage.title, url: `${BASE_URL}/${locale}/${catSlug}` },
  ]);

  const otherCategories = getOtherCategories(categoryId);

  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="container mx-auto px-4 py-12">
        <nav className="mb-6 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
                {dict.categoryPages.breadcrumbs.home}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">{categoryPage.title}</li>
          </ol>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{categoryPage.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {categoryPage.subtitle}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {readyTools.length} {locale === "pl" ? "dostępnych narzędzi" : "available tools"}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {readyTools.map((tool) => {
            const toolDict = dict.tools[tool.id as keyof typeof dict.tools];
            const Icon = tool.icon;
            return (
              <Link key={tool.id} href={getToolUrl(tool, locale)}>
                <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg mt-3">{toolDict?.name || tool.id}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{toolDict?.description || ""}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {comingSoonTools.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-muted-foreground">
              {locale === "pl" ? "Wkrótce dostępne" : "Coming soon"}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {comingSoonTools.map((tool) => {
                const toolDict = dict.tools[tool.id as keyof typeof dict.tools];
                const Icon = tool.icon;
                return (
                  <Card key={tool.id} className="h-full opacity-60">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-muted text-muted-foreground w-fit">
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant="secondary">
                          {locale === "pl" ? "Wkrótce" : "Soon"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-3 text-muted-foreground">
                        {toolDict?.name || tool.id}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{toolDict?.description || ""}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Why Us Section */}
        <section className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{dict.home.whyUs.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex rounded-full bg-primary/10 p-3 mb-4"><Zap className="h-6 w-6 text-primary" /></div>
              <h3 className="font-semibold mb-2">{dict.home.whyUs.fast.title}</h3>
              <p className="text-sm text-muted-foreground">{dict.home.whyUs.fast.description}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex rounded-full bg-primary/10 p-3 mb-4"><Shield className="h-6 w-6 text-primary" /></div>
              <h3 className="font-semibold mb-2">{dict.home.whyUs.secure.title}</h3>
              <p className="text-sm text-muted-foreground">{dict.home.whyUs.secure.description}</p>
            </div>
            <div className="text-center">
              <div className="inline-flex rounded-full bg-primary/10 p-3 mb-4"><UserX className="h-6 w-6 text-primary" /></div>
              <h3 className="font-semibold mb-2">{dict.home.whyUs.noRegister.title}</h3>
              <p className="text-sm text-muted-foreground">{dict.home.whyUs.noRegister.description}</p>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        {categoryPage.seoContent && (
          <SeoContent blocks={categoryPage.seoContent as SeoBlock[]} />
        )}

        {/* Discover Other Categories */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">
            {locale === "pl" ? "Odkryj inne kategorie" : "Discover other categories"}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {otherCategories.map((catId) => {
              const color = CATEGORY_COLORS[catId];
              return (
                <Link key={catId} href={getCategoryUrl(catId, locale)} className="group">
                  <Card className={`h-full transition-all hover:shadow-lg hover:border-${color}-500/50`}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-3 h-3 rounded-full bg-${color}-500 mx-auto mb-3`} />
                      <h3 className="font-semibold transition-colors">{dict.categories[catId]}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {dict.categoryPages[catId].subtitle}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
