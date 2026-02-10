import { Metadata } from "next";
import Link from "next/link";
import { Zap, Shield, UserX } from "lucide-react";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getToolsByCategory, categoryMeta, getToolUrl, getCategoryUrl } from "@/lib/tools";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { JsonLd, generateCollectionPageSchema, generateBreadcrumbSchema } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";

const BASE_URL = "https://utllo.com";

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
    keywords: [
      "kalkulator online",
      "kalkulator bmi",
      "kalkulator proporcji",
      "średnia ważona",
      "kalkulator średniej",
      "kalkulator snu",
      "cykle snu",
      "kalkulator kalorii",
      "zapotrzebowanie kaloryczne",
      "kalkulator grupy krwi",
      "dziedziczenie grupy krwi",
      "grupa krwi dziecka",
      "kalkulator inflacji",
      "inflacja",
      "siła nabywcza",
      "psie lata na ludzkie",
      "kalkulator psich lat",
      "wiek psa",
      "cyfry rzymskie",
      "kalkulator cyfr rzymskich",
      "konwerter cyfr rzymskich",
      "rzymskie na arabskie",
      "kocie lata na ludzkie",
      "kalkulator kocich lat",
      "wiek kota",
      "ile lat ma kot",
      "obliczenia online",
      "darmowy kalkulator",
      "bmi calculator",
    ],
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

  const readyTools = tools.filter((t) => t.isReady);
  const comingSoonTools = tools.filter((t) => !t.isReady);

  const collectionSchema = generateCollectionPageSchema({
    name: categoryPage.title,
    description: categoryPage.seoDescription,
    url: `${BASE_URL}/${locale}/${categoryMeta.calculators.slug}`,
    items: readyTools.map((tool) => ({
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
            {readyTools.length} dostępnych kalkulatorów
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
            <h2 className="text-2xl font-bold mb-4">Kalkulatory online - szybkie i dokładne obliczenia</h2>
            <p className="text-muted-foreground">
              Nasze kalkulatory online umożliwiają szybkie i precyzyjne obliczenia bez potrzeby 
              instalowania oprogramowania. Każdy kalkulator jest zoptymalizowany pod kątem 
              dokładności i łatwości użytkowania.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Kalkulator BMI</h3>
            <p className="text-muted-foreground">
              Oblicz swój wskaźnik masy ciała (Body Mass Index) podając wagę i wzrost. 
              Kalkulator pokazuje Twoją kategorię wagową (niedowaga, norma, nadwaga, otyłość) 
              oraz interpretację wyniku. Przydatny do monitorowania zdrowia i planowania diety.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Kalkulator proporcji</h3>
            <p className="text-muted-foreground">
              Rozwiązuj równania proporcji (a:b = c:x) szybko i dokładnie. Wpisz trzy znane 
              wartości, a kalkulator obliczy czwartą. Niezbędny w matematyce, gotowaniu, 
              fotografii, budownictwie i wielu innych dziedzinach.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Kalkulator średniej ważonej</h3>
            <p className="text-muted-foreground">
              Oblicz średnią ważoną z dowolną liczbą wartości i wag. Idealny do obliczania 
              średniej ocen szkolnych i akademickich, wyników egzaminów, ocen projektów 
              z różnymi wagami. Dodawaj i usuwaj wiersze dynamicznie.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Często zadawane pytania</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Jak oblicza się BMI?</h4>
                <p className="text-sm text-muted-foreground">
                  BMI = waga (kg) / wzrost (m)². Na przykład, osoba ważąca 70 kg i mierząca 
                  175 cm ma BMI = 70 / 1.75² = 22.9 (norma).
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Czym jest średnia ważona?</h4>
                <p className="text-sm text-muted-foreground">
                  Średnia ważona to średnia, w której każda wartość ma przypisaną wagę 
                  (znaczenie). Na przykład, ocena z egzaminu (waga 3) liczy się bardziej 
                  niż ocena z kartkówki (waga 1).
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Czy wyniki są dokładne?</h4>
                <p className="text-sm text-muted-foreground">
                  Tak. Nasze kalkulatory używają standardowych algorytmów matematycznych 
                  z precyzją do kilku miejsc po przecinku.
                </p>
              </div>
            </div>
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
            <Link href={getCategoryUrl("randomizers", locale)} className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-orange-500/50">
                <CardContent className="p-6 text-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mx-auto mb-3" />
                  <h3 className="font-semibold group-hover:text-orange-600 transition-colors">{dict.categories.randomizers}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{dict.categoryPages.randomizers.subtitle}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
