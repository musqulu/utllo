import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getToolsByCategory, getToolByCategoryAndSlug, categoryMeta, getToolUrl, getRelatedTools } from "@/lib/tools";
import { JsonLd, generateWebApplicationSchema, generateBreadcrumbSchema } from "@/components/seo/json-ld";
import { ToolPlaceholder } from "@/components/layout/tool-placeholder";

// Tool Components
import { NumberGenerator } from "@/components/random-number/number-generator";
import { NumbersGenerator } from "@/components/random-numbers/numbers-generator";
import { YesNoGenerator } from "@/components/random-yesno/yesno-generator";

const BASE_URL = "https://uttlo.com";
const CATEGORY = "randomizers";
const CATEGORY_SLUG = categoryMeta[CATEGORY].slug;

interface PageProps {
  params: Promise<{ locale: Locale; tool: string }>;
}

export async function generateStaticParams() {
  const tools = getToolsByCategory(CATEGORY);
  const params: { locale: string; tool: string }[] = [];
  
  for (const locale of i18n.locales) {
    for (const tool of tools) {
      params.push({ locale, tool: tool.slug });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, tool: toolSlug } = await params;
  const tool = getToolByCategoryAndSlug(CATEGORY_SLUG, toolSlug);
  
  if (!tool) return { title: "Not Found" };
  
  const dict = await getDictionary(locale);
  const toolDict = dict.tools[tool.id as keyof typeof dict.tools];

  return {
    title: toolDict?.seoTitle || tool.id,
    description: toolDict?.seoDescription || "",
    alternates: {
      canonical: `${BASE_URL}${getToolUrl(tool, locale)}`,
    },
    openGraph: {
      title: toolDict?.seoTitle || tool.id,
      description: toolDict?.seoDescription || "",
      url: `${BASE_URL}${getToolUrl(tool, locale)}`,
      siteName: dict.brand,
      locale: locale,
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { locale, tool: toolSlug } = await params;
  const tool = getToolByCategoryAndSlug(CATEGORY_SLUG, toolSlug);
  
  if (!tool) notFound();
  
  const dict = await getDictionary(locale);
  const toolDict = dict.tools[tool.id as keyof typeof dict.tools] as any;
  const categoryPage = dict.categoryPages[CATEGORY];
  const relatedTools = getRelatedTools(tool.id, 3);

  const webAppSchema = generateWebApplicationSchema({
    name: toolDict?.seoTitle || tool.id,
    description: toolDict?.seoDescription || "",
    url: `${BASE_URL}${getToolUrl(tool, locale)}`,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.categoryPages.breadcrumbs.home, url: `${BASE_URL}/${locale}` },
    { name: categoryPage.title, url: `${BASE_URL}/${locale}/${CATEGORY_SLUG}` },
    { name: toolDict?.name || tool.id, url: `${BASE_URL}${getToolUrl(tool, locale)}` },
  ]);

  // Render the appropriate tool component
  const renderToolComponent = () => {
    if (!tool.isReady) {
      return <ToolPlaceholder name={toolDict?.name || tool.id} />;
    }

    switch (tool.id) {
      case "random-number":
        return (
          <NumberGenerator
            dictionary={{
              min: toolDict.min || "Minimum",
              max: toolDict.max || "Maksimum",
              result: toolDict.result || "Wynik",
              generate: toolDict.generate || "Losuj",
              copy: dict.common.copy,
              copied: dict.common.copied,
            }}
          />
        );
      case "random-numbers":
        return (
          <NumbersGenerator
            dictionary={{
              min: toolDict.min || "Minimum",
              max: toolDict.max || "Maksimum",
              count: toolDict.count || "Ilość",
              unique: toolDict.unique || "Unikalne",
              sorted: toolDict.sorted || "Posortowane",
              results: toolDict.results || "Wyniki",
              generate: toolDict.generate || "Losuj",
              copyAll: toolDict.copyAll || "Kopiuj wszystkie",
              copy: dict.common.copy,
              copied: dict.common.copied,
            }}
          />
        );
      case "random-yesno":
        return (
          <YesNoGenerator
            dictionary={{
              yes: toolDict.yes || "TAK",
              no: toolDict.no || "NIE",
              askQuestion: toolDict.askQuestion || "Zadaj pytanie",
              questionPlaceholder: toolDict.questionPlaceholder || "Wpisz swoje pytanie...",
              generate: toolDict.generate || "Losuj",
              result: toolDict.result || "Wynik",
              tryAgain: toolDict.tryAgain || "Spróbuj ponownie",
            }}
          />
        );
      default:
        return <ToolPlaceholder name={toolDict?.name || tool.id} />;
    }
  };

  // Render SEO content based on tool
  const renderSeoContent = () => {
    switch (tool.id) {
      case "random-number":
        return (
          <section className="max-w-2xl mx-auto mt-12 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Generator Liczb Losowych Online
            </h2>
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                Nasz generator liczb losowych używa kryptograficznie bezpiecznego 
                algorytmu do generowania prawdziwie losowych wyników.
              </p>
              <p>
                Idealne do gier, konkursów, podejmowania decyzji i wszelkich 
                sytuacji wymagających losowego wyboru liczby.
              </p>
            </div>
          </section>
        );
      case "random-numbers":
        return (
          <section className="max-w-2xl mx-auto mt-12 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Losuj Wiele Liczb Jednocześnie
            </h2>
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                Generator pozwala na losowanie wielu liczb na raz. Możesz wybrać 
                czy liczby mają być unikalne czy mogą się powtarzać.
              </p>
              <p>
                Idealny do loterii, losowania nagród, wybierania grup i innych 
                zastosowań wymagających wielu losowych wartości.
              </p>
            </div>
          </section>
        );
      case "random-yesno":
        return (
          <section className="max-w-2xl mx-auto mt-12 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Generator Decyzji Tak/Nie
            </h2>
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                Nie możesz się zdecydować? Pozwól losowi wybrać za Ciebie! 
                Nasz generator daje szansę 50/50 na każdy wynik.
              </p>
              <p>
                Animowany interfejs sprawia, że podejmowanie decyzji jest 
                przyjemne i ekscytujące. Idealne do codziennych dylematów.
              </p>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

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
              <Link href={`/${locale}/${CATEGORY_SLUG}`} className="hover:text-foreground transition-colors">
                {categoryPage.title}
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium">{toolDict?.name || tool.id}</li>
          </ol>
        </nav>

        {/* Tool Component */}
        <div className="max-w-2xl mx-auto">
          {renderToolComponent()}
        </div>

        {/* SEO Content */}
        {renderSeoContent()}

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
