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
  const categoryPage = dict.categoryPages.calculators;

  return {
    title: categoryPage.seoTitle,
    description: categoryPage.seoDescription,
    keywords: ["kalkulator online", "kalkulator bmi", "kalkulator proporcji", "obliczenia online", "darmowe kalkulatory"],
    alternates: {
      canonical: `${BASE_URL}/${locale}/${categoryMeta.calculators.slug}`,
    },
    openGraph: {
      title: categoryPage.seoTitle,
      description: categoryPage.seoDescription,
      url: `${BASE_URL}/${locale}/${categoryMeta.calculators.slug}`,
      siteName: dict.brand,
      locale: locale,
      type: "website",
    },
  };
}

export default async function CalculatorsCategoryPage({ params }: PageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const tools = getToolsByCategory("calculators");
  const categoryPage = dict.categoryPages.calculators;

  const collectionSchema = generateCollectionPageSchema({
    name: categoryPage.title,
    description: categoryPage.seoDescription,
    url: `${BASE_URL}/${locale}/${categoryMeta.calculators.slug}`,
    items: tools.filter(t => t.isReady).map((tool) => ({
      name: dict.tools[tool.id as keyof typeof dict.tools]?.name || tool.id,
      url: `${BASE_URL}${getToolUrl(tool, locale)}`,
    })),
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.categoryPages.breadcrumbs.home, url: `${BASE_URL}/${locale}` },
    { name: categoryPage.title, url: `${BASE_URL}/${locale}/${categoryMeta.calculators.slug}` },
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
          <h2>Kalkulatory online - szybkie i dokładne obliczenia</h2>
          <p>
            Nasze kalkulatory online umożliwiają szybkie wykonywanie różnorodnych obliczeń 
            matematycznych i zdrowotnych. Wszystkie narzędzia działają w przeglądarce i nie 
            wymagają instalacji.
          </p>
          
          <h3>Kalkulator BMI</h3>
          <p>
            Oblicz swój wskaźnik masy ciała (BMI) i sprawdź, czy Twoja waga mieści się w normie. 
            Kalkulator pokazuje kategorię wagową i pomaga monitorować zdrowie.
          </p>
          
          <h3>Kalkulator proporcji</h3>
          <p>
            Rozwiązuj równania proporcji szybko i bezbłędnie. Wpisz trzy znane wartości, 
            a kalkulator obliczy czwartą. Przydatny w matematyce, gotowaniu, fotografii i wielu 
            innych dziedzinach.
          </p>

          <h3>Dokładność obliczeń</h3>
          <p>
            Wszystkie nasze kalkulatory używają precyzyjnych algorytmów matematycznych, 
            zapewniając dokładne wyniki. Interfejs jest prosty i intuicyjny, dzięki czemu 
            obliczenia zajmują tylko chwilę.
          </p>
        </section>
      </div>
    </>
  );
}
