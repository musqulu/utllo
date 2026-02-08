import { Metadata } from "next";
import Link from "next/link";
import { Zap, Shield, UserX } from "lucide-react";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getToolsByCategory, categoryMeta, getToolUrl, getCategoryUrl } from "@/lib/tools";
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
    keywords: [
      "losuj liczby",
      "losuj liczbe",
      "generator losowy",
      "losuj tak nie",
      "losowanie online",
      "generator liczb",
      "losowy cytat",
      "karta tarota",
    ],
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

  const readyTools = tools.filter((t) => t.isReady);
  const comingSoonTools = tools.filter((t) => !t.isReady);

  const collectionSchema = generateCollectionPageSchema({
    name: categoryPage.title,
    description: categoryPage.seoDescription,
    url: `${BASE_URL}/${locale}/${categoryMeta.randomizers.slug}`,
    items: readyTools.map((tool) => ({
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
            {readyTools.length} dostępnych generatorów
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
            <h2 className="text-xl font-semibold mb-6 text-muted-foreground">Wkrótce dostępne</h2>
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
                        <Badge variant="secondary">Wkrótce</Badge>
                      </div>
                      <CardTitle className="text-lg mt-3 text-muted-foreground">{toolDict?.name || tool.id}</CardTitle>
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

        <section className="mt-16 max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="text-2xl font-bold mb-4">Generatory losowe online - uczciwe losowanie</h2>
            <p className="text-muted-foreground">
              Nasze generatory losowe zapewniają szybkie i sprawiedliwe losowanie. Każdy wynik 
              jest generowany za pomocą kryptograficznie bezpiecznych algorytmów, co gwarantuje 
              pełną losowość i nieprzewidywalność rezultatów.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Losuj liczbę / liczby</h3>
            <p className="text-muted-foreground">
              Generuj losowe liczby w dowolnym zakresie. Ustaw minimum i maksimum, 
              a generator wybierze losową liczbę lub zestaw liczb. Idealne do gier 
              planszowych, konkursów, loterii i szybkich decyzji.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Losuj Tak / Nie</h3>
            <p className="text-muted-foreground">
              Nie możesz się zdecydować? Nasz generator podejmie decyzję za Ciebie. 
              Animowany interfejs sprawia, że losowanie jest zabawne i ekscytujące. 
              Działa jak wirtualna moneta - szybko i bezstronnie.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Do czego przydaje się losowanie?</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Gry planszowe i RPG - rzuty kostką, losowanie kolejności</li>
              <li>Konkursy i losowania - wybór zwycięzców</li>
              <li>Edukacja - losowe pytania, grupy, zadania</li>
              <li>Codzienne decyzje - co jeść, gdzie iść, co oglądać</li>
              <li>Programowanie - generowanie danych testowych</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Jak zapewniamy losowość?</h3>
            <p className="text-muted-foreground">
              Używamy interfejsu <code className="text-sm bg-muted px-1.5 py-0.5 rounded">crypto.getRandomValues()</code> 
              dostępnego w nowoczesnych przeglądarkach, który zapewnia kryptograficznie bezpieczne 
              generowanie liczb losowych. To ten sam mechanizm, którego używają banki i systemy bezpieczeństwa.
            </p>
          </div>
        </section>

        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">Odkryj inne kategorie</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href={getCategoryUrl("tools", locale)} className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-blue-500/50">
                <CardContent className="p-6 text-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-3" />
                  <h3 className="font-semibold group-hover:text-blue-600 transition-colors">{dict.categories.tools}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{dict.categoryPages.tools.subtitle}</p>
                </CardContent>
              </Card>
            </Link>
            <Link href={getCategoryUrl("converters", locale)} className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-green-500/50">
                <CardContent className="p-6 text-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold group-hover:text-green-600 transition-colors">{dict.categories.converters}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{dict.categoryPages.converters.subtitle}</p>
                </CardContent>
              </Card>
            </Link>
            <Link href={getCategoryUrl("calculators", locale)} className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-purple-500/50">
                <CardContent className="p-6 text-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mx-auto mb-3" />
                  <h3 className="font-semibold group-hover:text-purple-600 transition-colors">{dict.categories.calculators}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{dict.categoryPages.calculators.subtitle}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
