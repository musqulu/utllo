import { Metadata } from "next";
import Link from "next/link";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getToolsByCategory, categoryMeta, getToolUrl } from "@/lib/tools";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { JsonLd, generateCollectionPageSchema, generateBreadcrumbSchema } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";

const BASE_URL = "https://uttlo.com";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const categoryPage = dict.categoryPages.tools;

  return {
    title: categoryPage.seoTitle,
    description: categoryPage.seoDescription,
    keywords: ["narzędzia online", "generator haseł", "lorem ipsum", "darmowe narzędzia", "narzędzia dla programistów"],
    alternates: {
      canonical: `${BASE_URL}/${locale}/${categoryMeta.tools.slug}`,
    },
    openGraph: {
      title: categoryPage.seoTitle,
      description: categoryPage.seoDescription,
      url: `${BASE_URL}/${locale}/${categoryMeta.tools.slug}`,
      siteName: dict.brand,
      locale: locale,
      type: "website",
    },
  };
}

export default async function ToolsCategoryPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const tools = getToolsByCategory("tools");
  const categoryPage = dict.categoryPages.tools;

  const collectionSchema = generateCollectionPageSchema({
    name: categoryPage.title,
    description: categoryPage.seoDescription,
    url: `${BASE_URL}/${locale}/${categoryMeta.tools.slug}`,
    items: tools.filter(t => t.isReady).map((tool) => ({
      name: dict.tools[tool.id as keyof typeof dict.tools]?.name || tool.id,
      url: `${BASE_URL}${getToolUrl(tool, locale)}`,
    })),
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.categoryPages.breadcrumbs.home, url: `${BASE_URL}/${locale}` },
    { name: categoryPage.title, url: `${BASE_URL}/${locale}/${categoryMeta.tools.slug}` },
  ]);

  return (
    <>
      <JsonLd data={collectionSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
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

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{categoryPage.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {categoryPage.subtitle}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {tools.map((tool) => {
            const toolDict = dict.tools[tool.id as keyof typeof dict.tools];
            const Icon = tool.icon;
            
            return (
              <Link key={tool.id} href={tool.isReady ? getToolUrl(tool, locale) : "#"}>
                <Card className={`h-full transition-all hover:shadow-lg ${!tool.isReady ? 'opacity-60' : 'hover:border-primary/50'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      {!tool.isReady && (
                        <Badge variant="secondary">Wkrótce</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-3">
                      {toolDict?.name || tool.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      {toolDict?.description || ""}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* SEO Content */}
        <section className="mt-16 max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h2>Darmowe narzędzia online dla każdego</h2>
          <p>
            Nasza kolekcja narzędzi online oferuje szeroki wybór przydatnych aplikacji dla programistów, 
            projektantów i wszystkich użytkowników internetu. Wszystkie narzędzia działają bezpośrednio 
            w przeglądarce - nie musisz niczego instalować ani rejestrować się.
          </p>
          
          <h3>Generator haseł</h3>
          <p>
            Twórz silne, bezpieczne hasła z naszym darmowym generatorem. Możesz dostosować długość hasła, 
            wybierać typy znaków i generować wiele haseł jednocześnie.
          </p>
          
          <h3>Lorem Ipsum</h3>
          <p>
            Generuj tekst zastępczy do projektów graficznych i stron internetowych. Wybierz liczbę 
            akapitów, zdań lub słów i skopiuj gotowy tekst jednym kliknięciem.
          </p>

          <h3>Bezpieczeństwo i prywatność</h3>
          <p>
            Wszystkie nasze narzędzia przetwarzają dane lokalnie w Twojej przeglądarce. Żadne informacje 
            nie są wysyłane na nasze serwery, co gwarantuje pełną prywatność Twoich danych.
          </p>
        </section>
      </div>
    </>
  );
}
