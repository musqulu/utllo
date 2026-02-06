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
  const categoryPage = dict.categoryPages.randomizers;

  return {
    title: categoryPage.seoTitle,
    description: categoryPage.seoDescription,
    keywords: ["generator losowy", "losuj liczby", "losuj tak nie", "generator liczb", "losowanie online"],
    alternates: {
      canonical: `${BASE_URL}/${locale}/${categoryMeta.randomizers.slug}`,
    },
    openGraph: {
      title: categoryPage.seoTitle,
      description: categoryPage.seoDescription,
      url: `${BASE_URL}/${locale}/${categoryMeta.randomizers.slug}`,
      siteName: dict.brand,
      locale: locale,
      type: "website",
    },
  };
}

export default async function RandomizersCategoryPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const tools = getToolsByCategory("randomizers");
  const categoryPage = dict.categoryPages.randomizers;

  const collectionSchema = generateCollectionPageSchema({
    name: categoryPage.title,
    description: categoryPage.seoDescription,
    url: `${BASE_URL}/${locale}/${categoryMeta.randomizers.slug}`,
    items: tools.filter(t => t.isReady).map((tool) => ({
      name: dict.tools[tool.id as keyof typeof dict.tools]?.name || tool.id,
      url: `${BASE_URL}${getToolUrl(tool, locale)}`,
    })),
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.categoryPages.breadcrumbs.home, url: `${BASE_URL}/${locale}` },
    { name: categoryPage.title, url: `${BASE_URL}/${locale}/${categoryMeta.randomizers.slug}` },
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
          <h2>Generatory losowe online - szybkie losowanie</h2>
          <p>
            Nasze generatory losowe umożliwiają szybkie i sprawiedliwe losowanie liczb, podejmowanie 
            decyzji i generowanie losowych wyników. Wszystko działa w przeglądarce bez potrzeby 
            instalowania dodatkowego oprogramowania.
          </p>
          
          <h3>Losuj liczby</h3>
          <p>
            Generator liczb losowych pozwala na losowanie pojedynczych liczb lub całych zestawów 
            w określonym zakresie. Idealny do gier, konkursów, loterii i wszelkich sytuacji 
            wymagających losowego wyboru.
          </p>
          
          <h3>Losuj Tak / Nie</h3>
          <p>
            Potrzebujesz pomocy w podjęciu decyzji? Nasz generator Tak/Nie pomoże Ci w szybkim 
            i bezstronnym podjęciu wyboru. Animowany interfejs sprawia, że losowanie jest 
            przyjemne i ekscytujące.
          </p>

          <h3>Uczciwe losowanie</h3>
          <p>
            Wszystkie nasze generatory używają kryptograficznie bezpiecznych algorytmów losowych, 
            zapewniając uczciwe i nieprzewidywalne wyniki każdego losowania.
          </p>
        </section>
      </div>
    </>
  );
}
