import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getToolsByCategory, getToolByCategoryAndSlug, categoryMeta, getToolUrl, getRelatedTools } from "@/lib/tools";
import { JsonLd, generateWebApplicationSchema, generateBreadcrumbSchema } from "@/components/seo/json-ld";
import { ToolPlaceholder } from "@/components/layout/tool-placeholder";

// Tool Components
import { BMICalculator } from "@/components/calculators/bmi-calculator";
import { ProportionCalculator } from "@/components/calculators/proportion-calculator";
import { WeightedAverageCalculator } from "@/components/calculators/weighted-average-calculator";

const BASE_URL = "https://uttlo.com";
const CATEGORY = "calculators";
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
      case "bmi-calculator":
        return (
          <BMICalculator
            dictionary={{
              title: toolDict.title || "Kalkulator BMI",
              subtitle: toolDict.subtitle || "Oblicz swój wskaźnik masy ciała",
              weight: toolDict.weight || "Waga (kg)",
              height: toolDict.height || "Wzrost (cm)",
              calculate: toolDict.calculate || "Oblicz BMI",
              result: toolDict.result || "Twoje BMI",
              category: toolDict.category || "Kategoria",
              underweight: toolDict.underweight || "Niedowaga",
              normal: toolDict.normal || "Waga prawidłowa",
              overweight: toolDict.overweight || "Nadwaga",
              obese: toolDict.obese || "Otyłość I stopnia",
              severelyObese: toolDict.severelyObese || "Otyłość II stopnia",
              morbidlyObese: toolDict.morbidlyObese || "Otyłość III stopnia",
              clear: toolDict.clear || "Wyczyść",
            }}
          />
        );
      case "proportion-calculator":
        return (
          <ProportionCalculator
            dictionary={{
              title: toolDict.title || "Kalkulator Proporcji",
              subtitle: toolDict.subtitle || "Rozwiąż równanie proporcji",
              formula: toolDict.formula || "A / B = C / X",
              valueA: toolDict.valueA || "Wartość A",
              valueB: toolDict.valueB || "Wartość B",
              valueC: toolDict.valueC || "Wartość C",
              valueX: toolDict.valueX || toolDict.result || "Wynik (X)",
              calculate: toolDict.calculate || "Oblicz",
              result: toolDict.result || "Wynik",
              copy: dict.common.copy,
              clear: toolDict.clear || "Wyczyść",
            }}
          />
        );
      case "weighted-average":
        return (
          <WeightedAverageCalculator
            dictionary={{
              title: toolDict.title || "Kalkulator Średniej Ważonej",
              subtitle: toolDict.subtitle || "Oblicz średnią ważoną z uwzględnieniem wag",
              value: toolDict.value || "Wartość",
              weight: toolDict.weight || "Waga",
              addRow: toolDict.addRow || "Dodaj wiersz",
              removeRow: toolDict.removeRow || "Usuń",
              calculate: toolDict.calculate || "Oblicz średnią",
              result: toolDict.result || "Średnia ważona",
              sumOfWeights: toolDict.sumOfWeights || "Suma wag",
              clear: toolDict.clear || "Wyczyść wszystko",
              copy: toolDict.copy || "Kopiuj wynik",
              example: toolDict.example || "Przykład",
              loadExample: toolDict.loadExample || "Załaduj przykład ocen",
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
      case "bmi-calculator":
        return (
          <section className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              Kalkulator BMI Online - Oblicz Swój Wskaźnik Masy Ciała
            </h2>
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4">Czym jest BMI?</h3>
              <p className="text-muted-foreground mb-4">
                BMI (Body Mass Index), czyli wskaźnik masy ciała, to międzynarodowa
                miara używana do oceny, czy masa ciała osoby dorosłej jest prawidłowa
                w stosunku do jej wzrostu.
              </p>
              <div className="p-4 bg-muted rounded-lg text-center font-mono">
                <p className="text-lg mb-2">BMI = waga (kg) ÷ wzrost² (m)</p>
                <p className="text-sm text-muted-foreground">
                  Przykład: 70 kg ÷ (1.75 m)² = 70 ÷ 3.0625 = 22.9
                </p>
              </div>
            </div>
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4">Kategorie BMI według WHO</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left">Kategoria</th>
                      <th className="border p-3 text-left">Zakres BMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border p-3 text-blue-500">Niedowaga</td><td className="border p-3">&lt; 18.5</td></tr>
                    <tr><td className="border p-3 text-green-500">Waga prawidłowa</td><td className="border p-3">18.5 - 24.9</td></tr>
                    <tr><td className="border p-3 text-yellow-500">Nadwaga</td><td className="border p-3">25 - 29.9</td></tr>
                    <tr><td className="border p-3 text-orange-500">Otyłość I stopnia</td><td className="border p-3">30 - 34.9</td></tr>
                    <tr><td className="border p-3 text-red-500">Otyłość II stopnia</td><td className="border p-3">35 - 39.9</td></tr>
                    <tr><td className="border p-3 text-red-700">Otyłość III stopnia</td><td className="border p-3">&ge; 40</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        );
      case "proportion-calculator":
        return (
          <section className="max-w-2xl mx-auto mt-12 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Kalkulator Proporcji Online
            </h2>
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                Nasz kalkulator proporcji rozwiązuje równania w formie A/B = C/X. 
                Wystarczy wprowadzić trzy znane wartości, a kalkulator obliczy czwartą.
              </p>
              <p>
                Proporcje są używane w wielu dziedzinach: matematyce, gotowaniu, 
                fotografii, budownictwie i projektowaniu. Ten kalkulator ułatwia 
                szybkie obliczenia bez konieczności ręcznych przekształceń.
              </p>
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">Wzór:</p>
                <p className="font-mono">X = (B × C) / A</p>
              </div>
            </div>
          </section>
        );
      case "weighted-average":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Kalkulator Średniej Ważonej Online
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Średnia ważona to specjalny rodzaj średniej, w której każda wartość ma 
                  przypisaną wagę określającą jej znaczenie. Jest szeroko stosowana w 
                  szkołach, na uczelniach, w finansach i analizie danych.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Jak obliczyć średnią ważoną?</h3>
              <div className="p-6 bg-muted rounded-lg space-y-4">
                <p className="text-center font-mono text-lg">
                  x̄ = (w₁·x₁ + w₂·x₂ + ... + wₙ·xₙ) / (w₁ + w₂ + ... + wₙ)
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  gdzie x to wartości, a w to odpowiadające im wagi
                </p>
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Przykład - oceny szkolne:</h4>
                <p className="text-sm text-muted-foreground">
                  Sprawdzian (waga 3): 5<br />
                  Kartkówka (waga 2): 4<br />
                  Odpowiedź (waga 1): 5<br /><br />
                  Średnia ważona = (3×5 + 2×4 + 1×5) / (3+2+1) = (15 + 8 + 5) / 6 = 28/6 ≈ <strong>4.67</strong>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Gdzie stosuje się średnią ważoną?</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Szkoła i studia</strong> - obliczanie średniej ocen z różnymi wagami (sprawdziany, kartkówki, odpowiedzi)</li>
                <li><strong>Finanse</strong> - obliczanie średniej ważonej kosztu kapitału (WACC)</li>
                <li><strong>Inwestycje</strong> - obliczanie średniej ceny zakupu akcji</li>
                <li><strong>Statystyka</strong> - analiza danych z różną istotnością obserwacji</li>
                <li><strong>Ocena pracowników</strong> - ważone kryteria oceny</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Średnia ważona vs zwykła średnia</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left">Cecha</th>
                      <th className="border p-3 text-left">Średnia arytmetyczna</th>
                      <th className="border p-3 text-left">Średnia ważona</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3">Wagi</td>
                      <td className="border p-3">Wszystkie równe (1)</td>
                      <td className="border p-3">Różne dla każdej wartości</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Wzór</td>
                      <td className="border p-3 font-mono text-sm">Σx / n</td>
                      <td className="border p-3 font-mono text-sm">Σ(w·x) / Σw</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Zastosowanie</td>
                      <td className="border p-3">Równoważne dane</td>
                      <td className="border p-3">Dane o różnej ważności</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Często zadawane pytania</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy wagi muszą sumować się do 1 lub 100%?</h4>
                  <p className="text-sm text-muted-foreground">
                    Nie, wagi mogą być dowolnymi liczbami dodatnimi. Kalkulator automatycznie 
                    dzieli sumę iloczynów przez sumę wag, więc wynik będzie poprawny niezależnie 
                    od skali wag.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jak obliczyć średnią ważoną ocen w dzienniku?</h4>
                  <p className="text-sm text-muted-foreground">
                    Wprowadź każdą ocenę jako wartość, a przypisaną jej wagę (np. sprawdzian = 3, 
                    kartkówka = 2, odpowiedź = 1). Kalkulator automatycznie obliczy średnią ważoną.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy mogę użyć wag ujemnych?</h4>
                  <p className="text-sm text-muted-foreground">
                    Nie, wagi muszą być liczbami dodatnimi. Waga oznacza znaczenie danej wartości, 
                    więc nie ma sensu stosować wartości ujemnych.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz kalkulator średniej ważonej działa całkowicie w przeglądarce. 
                Twoje dane nie są wysyłane na żaden serwer - wszystkie obliczenia 
                wykonywane są lokalnie na Twoim urządzeniu.
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
        <div className="max-w-lg mx-auto">
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
