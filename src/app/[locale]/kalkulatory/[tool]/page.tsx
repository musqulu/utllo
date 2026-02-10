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
import { SleepCalculator } from "@/components/calculators/sleep-calculator";
import { CalorieCalculator } from "@/components/calculators/calorie-calculator";
import { BloodTypeCalculator } from "@/components/calculators/blood-type-calculator";
import { InflationCalculator } from "@/components/calculators/inflation-calculator";
import { DogYearsCalculator } from "@/components/calculators/dog-years-calculator";
import { RomanNumeralsCalculator } from "@/components/calculators/roman-numerals-calculator";
import { CatYearsCalculator } from "@/components/calculators/cat-years-calculator";

const BASE_URL = "https://utllo.com";
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
      case "sleep-calculator":
        return (
          <SleepCalculator
            dictionary={{
              title: toolDict.title || "Kalkulator Snu",
              subtitle: toolDict.subtitle || "Oblicz optymalną godzinę snu lub budzenia",
              wakeUpAt: toolDict.wakeUpAt || "Chcę wstać o...",
              fallAsleepAt: toolDict.fallAsleepAt || "Chcę zasnąć o...",
              calculate: toolDict.calculate || "Oblicz",
              clear: toolDict.clear || "Wyczyść",
              cycles: toolDict.cycles || "cykli",
              hours: toolDict.hours || "godzin",
              optimal: toolDict.optimal || "Optymalnie",
              good: toolDict.good || "Dobrze",
              minimum: toolDict.minimum || "Minimum",
              timeToFallAsleep: toolDict.timeToFallAsleep || "Czas zasypiania",
              results: toolDict.results || "Wyniki",
              bedtimeResults: toolDict.bedtimeResults || "Powinieneś położyć się spać o:",
              wakeUpResults: toolDict.wakeUpResults || "Powinieneś wstać o:",
            }}
          />
        );
      case "calorie-calculator":
        return (
          <CalorieCalculator
            dictionary={{
              title: toolDict.title || "Kalkulator Kalorii",
              subtitle: toolDict.subtitle || "Oblicz dzienne zapotrzebowanie kaloryczne",
              gender: toolDict.gender || "Płeć",
              male: toolDict.male || "Mężczyzna",
              female: toolDict.female || "Kobieta",
              age: toolDict.age || "Wiek (lat)",
              weight: toolDict.weight || "Waga (kg)",
              height: toolDict.height || "Wzrost (cm)",
              activityLevel: toolDict.activityLevel || "Poziom aktywności",
              sedentary: toolDict.sedentary || "Siedzący (brak ćwiczeń)",
              lightlyActive: toolDict.lightlyActive || "Lekko aktywny (1-3 dni/tydzień)",
              moderatelyActive: toolDict.moderatelyActive || "Umiarkowanie aktywny (3-5 dni/tydzień)",
              veryActive: toolDict.veryActive || "Bardzo aktywny (6-7 dni/tydzień)",
              extremelyActive: toolDict.extremelyActive || "Ekstremalnie aktywny (sportowiec)",
              calculate: toolDict.calculate || "Oblicz kalorie",
              clear: toolDict.clear || "Wyczyść",
              bmr: toolDict.bmr || "BMR",
              bmrDesc: toolDict.bmrDesc || "Podstawowa przemiana materii",
              tdee: toolDict.tdee || "TDEE",
              tdeeDesc: toolDict.tdeeDesc || "Całkowity dzienny wydatek energetyczny",
              loseWeight: toolDict.loseWeight || "Odchudzanie",
              slowCut: toolDict.slowCut || "Wolna redukcja",
              maintenance: toolDict.maintenance || "Utrzymanie wagi",
              leanBulk: toolDict.leanBulk || "Czysta masa",
              bulk: toolDict.bulk || "Budowa masy",
              protein: toolDict.protein || "Białko",
              carbs: toolDict.carbs || "Węglowodany",
              fat: toolDict.fat || "Tłuszcze",
              kcalPerDay: toolDict.kcalPerDay || "kcal/dzień",
              weeklyChange: toolDict.weeklyChange || "Tygodniowo",
              goalResults: toolDict.goalResults || "Zapotrzebowanie kaloryczne wg celu",
              macros: toolDict.macros || "Makroskładniki",
            }}
          />
        );
      case "blood-type-calculator":
        return (
          <BloodTypeCalculator
            dictionary={{
              title: toolDict.title || "Kalkulator Grupy Krwi",
              subtitle: toolDict.subtitle || "Oblicz możliwą grupę krwi dziecka",
              parent1: toolDict.parent1 || "Rodzic 1",
              parent2: toolDict.parent2 || "Rodzic 2",
              bloodGroup: toolDict.bloodGroup || "Grupa krwi (ABO)",
              rhFactor: toolDict.rhFactor || "Czynnik Rh",
              calculate: toolDict.calculate || "Oblicz grupę krwi",
              clear: toolDict.clear || "Wyczyść",
              results: toolDict.results || "Wyniki",
              probability: toolDict.probability || "Prawdopodobieństwo",
              possibleTypes: toolDict.possibleTypes || "Możliwe grupy krwi dziecka",
              noResults: toolDict.noResults || "Brak wyników",
            }}
          />
        );
      case "inflation-calculator":
        return (
          <InflationCalculator
            dictionary={{
              title: toolDict.title || "Kalkulator Inflacji",
              subtitle: toolDict.subtitle || "Oblicz wpływ inflacji na wartość pieniądza",
              amount: toolDict.amount || "Kwota (PLN)",
              inflationRate: toolDict.inflationRate || "Roczna inflacja (%)",
              years: toolDict.years || "Liczba lat",
              calculate: toolDict.calculate || "Oblicz inflację",
              clear: toolDict.clear || "Wyczyść",
              futureValue: toolDict.futureValue || "Równowartość za X lat",
              purchasingPowerLoss: toolDict.purchasingPowerLoss || "Utrata siły nabywczej",
              purchasingPowerPercent: toolDict.purchasingPowerPercent || "Utrata wartości",
              yearByYear: toolDict.yearByYear || "Zmiana wartości rok po roku",
              year: toolDict.year || "Rok",
              value: toolDict.value || "Wartość",
              loss: toolDict.loss || "Utrata",
            }}
          />
        );
      case "dog-years-calculator":
        return (
          <DogYearsCalculator
            dictionary={{
              title: toolDict.title || "Psie Lata na Ludzkie",
              subtitle: toolDict.subtitle || "Przelicz wiek Twojego psa na ludzkie lata",
              dogAge: toolDict.dogAge || "Wiek psa (lata)",
              dogSize: toolDict.dogSize || "Rozmiar psa",
              small: toolDict.small || "Mały",
              smallDesc: toolDict.smallDesc || "np. York, Chihuahua, Shih Tzu",
              medium: toolDict.medium || "Średni",
              mediumDesc: toolDict.mediumDesc || "np. Beagle, Cocker Spaniel, Buldog",
              large: toolDict.large || "Duży",
              largeDesc: toolDict.largeDesc || "np. Labrador, Owczarek, Husky",
              giant: toolDict.giant || "Olbrzymi",
              giantDesc: toolDict.giantDesc || "np. Dog Niemiecki, Bernardyn",
              calculate: toolDict.calculate || "Przelicz wiek",
              clear: toolDict.clear || "Wyczyść",
              humanYears: toolDict.humanYears || "Wiek w ludzkich latach",
              lifeStage: toolDict.lifeStage || "Etap życia",
              result: toolDict.result || "ludzkich lat",
              lifeExpectancy: toolDict.lifeExpectancy || "Średnia długość życia",
              puppy: toolDict.puppy || "Szczeniak",
              young: toolDict.young || "Młody",
              adult: toolDict.adult || "Dorosły",
              senior: toolDict.senior || "Senior",
              geriatric: toolDict.geriatric || "Wiekowy",
            }}
          />
        );
      case "roman-numerals":
        return (
          <RomanNumeralsCalculator
            dictionary={{
              title: toolDict.title || "Kalkulator Cyfr Rzymskich",
              subtitle: toolDict.subtitle || "Przelicz liczby arabskie na rzymskie i odwrotnie",
              arabicToRoman: toolDict.arabicToRoman || "Arabskie → Rzymskie",
              romanToArabic: toolDict.romanToArabic || "Rzymskie → Arabskie",
              inputArabic: toolDict.inputArabic || "Liczba arabska (1-3999)",
              inputRoman: toolDict.inputRoman || "Cyfra rzymska",
              placeholderArabic: toolDict.placeholderArabic || "np. 2024",
              placeholderRoman: toolDict.placeholderRoman || "np. MMXXIV",
              result: toolDict.result || "Wynik",
              copy: toolDict.copy || "Kopiuj",
              copied: toolDict.copied || "Skopiowano!",
              clear: toolDict.clear || "Wyczyść",
              invalidNumber: toolDict.invalidNumber || "Wpisz liczbę od 1 do 3999",
              invalidRoman: toolDict.invalidRoman || "Nieprawidłowa cyfra rzymska",
              referenceTable: toolDict.referenceTable || "Tabela wartości",
            }}
          />
        );
      case "cat-years-calculator":
        return (
          <CatYearsCalculator
            dictionary={{
              title: toolDict.title || "Kocie Lata na Ludzkie",
              subtitle: toolDict.subtitle || "Przelicz wiek Twojego kota na ludzkie lata",
              catAge: toolDict.catAge || "Wiek kota (lata)",
              calculate: toolDict.calculate || "Przelicz wiek",
              clear: toolDict.clear || "Wyczyść",
              humanYears: toolDict.humanYears || "Wiek w ludzkich latach",
              lifeStage: toolDict.lifeStage || "Etap życia",
              result: toolDict.result || "ludzkich lat",
              lifeExpectancy: toolDict.lifeExpectancy || "Średnia długość życia",
              indoor: toolDict.indoor || "Kot domowy",
              outdoor: toolDict.outdoor || "Kot wychodzący",
              kitten: toolDict.kitten || "Kociak",
              junior: toolDict.junior || "Junior",
              adult: toolDict.adult || "Dorosły",
              mature: toolDict.mature || "Dojrzały",
              senior: toolDict.senior || "Senior",
              geriatric: toolDict.geriatric || "Wiekowy",
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
      case "sleep-calculator":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Kalkulator Snu Online - Oblicz Optymalny Czas Snu
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy kalkulator snu pomoże Ci obliczyć idealną godzinę zasypiania lub 
                  budzenia na podstawie naturalnych cykli snu. Dzięki niemu wstaniesz wypoczęty 
                  i pełen energii każdego dnia, bez uczucia zmęczenia i senności.
                </p>
                <p>
                  Kalkulator uwzględnia średni czas zasypiania (~14 minut) oraz 90-minutowe cykle snu, 
                  co pozwala na precyzyjne zaplanowanie odpoczynku nocnego.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Czym są cykle snu?</h3>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Sen nie jest jednorodnym procesem. Każdej nocy Twój mózg przechodzi przez 
                  powtarzające się cykle, z których każdy trwa około <strong>90 minut</strong>. 
                  Jeden cykl składa się z kilku faz:
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Faza 1 - Zasypianie</h4>
                  <p className="text-sm text-muted-foreground">
                    Lekki sen, łatwo się obudzić. Trwa 5-10 minut. Ciało zwalnia, mięśnie się rozluźniają.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Faza 2 - Sen lekki</h4>
                  <p className="text-sm text-muted-foreground">
                    Tętno zwalnia, temperatura ciała spada. Trwa około 20 minut. Mózg generuje wrzeciona snu.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Faza 3 - Sen głęboki</h4>
                  <p className="text-sm text-muted-foreground">
                    Najważniejsza faza regeneracji. Ciało naprawia tkanki, wzmacnia układ odpornościowy. 
                    Trudno się obudzić.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Faza REM</h4>
                  <p className="text-sm text-muted-foreground">
                    Faza marzeń sennych. Mózg konsoliduje wspomnienia i przetwarza emocje. 
                    Szybkie ruchy gałek ocznych.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Ile snu potrzebujesz?</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left">Grupa wiekowa</th>
                      <th className="border p-3 text-left">Zalecany czas snu</th>
                      <th className="border p-3 text-left">Cykle snu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3">Noworodki (0-3 mies.)</td>
                      <td className="border p-3">14-17 godzin</td>
                      <td className="border p-3">-</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Niemowlęta (4-11 mies.)</td>
                      <td className="border p-3">12-15 godzin</td>
                      <td className="border p-3">-</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Małe dzieci (1-2 lat)</td>
                      <td className="border p-3">11-14 godzin</td>
                      <td className="border p-3">-</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Przedszkolaki (3-5 lat)</td>
                      <td className="border p-3">10-13 godzin</td>
                      <td className="border p-3">7-9</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Dzieci szkolne (6-13 lat)</td>
                      <td className="border p-3">9-11 godzin</td>
                      <td className="border p-3">6-7</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Nastolatkowie (14-17 lat)</td>
                      <td className="border p-3">8-10 godzin</td>
                      <td className="border p-3">5-7</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Dorośli (18-64 lat)</td>
                      <td className="border p-3 font-medium">7-9 godzin</td>
                      <td className="border p-3 font-medium">5-6</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Seniorzy (65+ lat)</td>
                      <td className="border p-3">7-8 godzin</td>
                      <td className="border p-3">5-6</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Źródło: National Sleep Foundation
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Jak działa kalkulator snu?</h3>
              <div className="p-6 bg-muted rounded-lg space-y-4">
                <p className="text-muted-foreground">
                  Kalkulator snu oblicza optymalne godziny na podstawie prostego wzoru:
                </p>
                <div className="text-center">
                  <p className="font-mono text-lg mb-2">
                    Czas budzenia = Czas zaśnięcia + (N × 90 min)
                  </p>
                  <p className="font-mono text-lg">
                    Czas zaśnięcia = Czas położenia się + ~14 min
                  </p>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  gdzie N to liczba pełnych cykli snu (zwykle 3-6)
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Wskazówki dotyczące higieny snu</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Regularność</strong> - Kładź się i wstawaj o tych samych godzinach, także w weekendy</li>
                <li><strong>Temperatura</strong> - Utrzymuj temperaturę sypialni na poziomie 18-20°C</li>
                <li><strong>Ciemność</strong> - Używaj zasłon zaciemniających lub maski na oczy</li>
                <li><strong>Bez ekranów</strong> - Unikaj niebieskiego światła (telefon, komputer) 1h przed snem</li>
                <li><strong>Kofeina</strong> - Ogranicz kawę i herbatę po godzinie 14:00</li>
                <li><strong>Aktywność fizyczna</strong> - Ćwicz regularnie, ale nie tuż przed snem</li>
                <li><strong>Relaksacja</strong> - Wprowadź rytuał wieczorny: książka, ciepła kąpiel, medytacja</li>
                <li><strong>Alkohol</strong> - Unikaj alkoholu przed snem - zaburza fazę REM</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Dlaczego budzenie się między cyklami jest ważne?</h3>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground">
                  Kiedy budzik wyrwie Cię ze snu głębokiego (faza 3), czujesz się ospały, 
                  zdezorientowany i zmęczony - to zjawisko nazywa się <strong>bezwładnością snu</strong> 
                  (sleep inertia). Może trwać nawet do 30 minut. Natomiast gdy budzisz się na końcu 
                  cyklu (w fazie lekkiego snu), wstajesz naturalnie wypoczęty i pełen energii. 
                  Dlatego czasem 6 godzin snu (4 cykle) pozwala czuć się lepiej niż 7 godzin, 
                  jeśli budzik zadzwoni w środku głębokiego snu.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Często zadawane pytania</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Dlaczego kalkulator dodaje 14 minut?</h4>
                  <p className="text-sm text-muted-foreground">
                    Średni czas potrzebny dorosłemu człowiekowi na zaśnięcie to około 10-20 minut. 
                    Nasz kalkulator przyjmuje wartość 14 minut jako średnią. Jeśli wiesz, że zasypiasz 
                    szybciej lub wolniej, możesz odpowiednio skorygować godzinę.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy 3 cykle snu (4,5h) wystarczą?</h4>
                  <p className="text-sm text-muted-foreground">
                    Trzy cykle snu to absolutne minimum i nie powinny być stosowane regularnie. 
                    Dla dorosłych zaleca się 5-6 cykli (7,5-9h). Przewlekły niedobór snu prowadzi 
                    do problemów zdrowotnych, obniżonej koncentracji i osłabienia odporności.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">O której powinienem iść spać?</h4>
                  <p className="text-sm text-muted-foreground">
                    Zależy to od godziny, o której musisz wstać. Jeśli musisz wstać o 7:00, 
                    optymalnie powinieneś zasnąć o 21:46 (6 cykli = 9h) lub o 23:16 (5 cykli = 7,5h). 
                    Skorzystaj z kalkulatora powyżej, aby obliczyć dokładne godziny.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy każdy cykl snu trwa dokładnie 90 minut?</h4>
                  <p className="text-sm text-muted-foreground">
                    Nie, 90 minut to wartość średnia. W rzeczywistości cykl snu trwa od 80 do 120 minut 
                    i zmienia się w ciągu nocy - pierwsze cykle mają więcej snu głębokiego, 
                    a późniejsze więcej snu REM. Kalkulator używa średniej wartości 90 minut, 
                    która sprawdza się u większości osób.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz kalkulator snu działa całkowicie w przeglądarce. Nie wymaga instalacji 
                ani rejestracji. Twoje dane nie są nigdzie wysyłane - wszystkie obliczenia 
                wykonywane są lokalnie na Twoim urządzeniu.
              </p>
            </div>
          </section>
        );
      case "calorie-calculator":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Kalkulator Kalorii Online - Oblicz Dzienne Zapotrzebowanie Kaloryczne
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy kalkulator kalorii pomoże Ci obliczyć dzienne zapotrzebowanie 
                  kaloryczne na podstawie Twojej wagi, wzrostu, wieku, płci i poziomu aktywności 
                  fizycznej. Kalkulator wykorzystuje uznaną formułę Mifflin-St Jeor, która jest 
                  rekomendowana przez dietetyków i organizacje zdrowotne na całym świecie.
                </p>
                <p>
                  Niezależnie od tego, czy chcesz schudnąć, utrzymać wagę, czy zbudować masę 
                  mięśniową - nasz kalkulator poda Ci optymalne zapotrzebowanie kaloryczne 
                  oraz rozkład makroskładników (białko, węglowodany, tłuszcze) dla każdego celu.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Czym jest BMR i TDEE?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">BMR (Basal Metabolic Rate)</h4>
                  <p className="text-sm text-muted-foreground">
                    Podstawowa przemiana materii - to ilość kalorii, jaką Twój organizm spala 
                    w stanie całkowitego spoczynku, aby utrzymać podstawowe funkcje życiowe: 
                    oddychanie, krążenie krwi, pracę narządów wewnętrznych i termoregulację. 
                    BMR stanowi 60-75% całkowitego dziennego wydatku energetycznego.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">TDEE (Total Daily Energy Expenditure)</h4>
                  <p className="text-sm text-muted-foreground">
                    Całkowity dzienny wydatek energetyczny - to łączna ilość kalorii, jaką 
                    spalasz w ciągu dnia, uwzględniając aktywność fizyczną, trawienie pokarmu 
                    i codzienne czynności. TDEE = BMR × współczynnik aktywności. To wartość, 
                    na podstawie której planuje się dietę.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Wzór Mifflin-St Jeor</h3>
              <div className="p-6 bg-muted rounded-lg space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Formuła Mifflin-St Jeor (1990) jest uznawana za najdokładniejszą metodę 
                  obliczania BMR dla osób dorosłych. Została potwierdzona wieloma badaniami 
                  klinicznymi i jest zalecana przez American Dietetic Association.
                </p>
                <div className="text-center space-y-2">
                  <p className="font-mono">
                    <strong>Mężczyźni:</strong> BMR = 10 × waga(kg) + 6,25 × wzrost(cm) − 5 × wiek + 5
                  </p>
                  <p className="font-mono">
                    <strong>Kobiety:</strong> BMR = 10 × waga(kg) + 6,25 × wzrost(cm) − 5 × wiek − 161
                  </p>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Następnie TDEE = BMR × współczynnik aktywności fizycznej
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Poziomy aktywności fizycznej</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left">Poziom</th>
                      <th className="border p-3 text-left">Opis</th>
                      <th className="border p-3 text-left">Mnożnik</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3 font-medium">Siedzący</td>
                      <td className="border p-3 text-sm">Praca biurowa, brak ćwiczeń</td>
                      <td className="border p-3 font-mono">×1,2</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Lekko aktywny</td>
                      <td className="border p-3 text-sm">Lekkie ćwiczenia 1-3 razy w tygodniu</td>
                      <td className="border p-3 font-mono">×1,375</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Umiarkowanie aktywny</td>
                      <td className="border p-3 text-sm">Ćwiczenia 3-5 razy w tygodniu</td>
                      <td className="border p-3 font-mono">×1,55</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Bardzo aktywny</td>
                      <td className="border p-3 text-sm">Intensywne ćwiczenia 6-7 razy w tygodniu</td>
                      <td className="border p-3 font-mono">×1,725</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Ekstremalnie aktywny</td>
                      <td className="border p-3 text-sm">Sportowiec, ciężka praca fizyczna + trening</td>
                      <td className="border p-3 font-mono">×1,9</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Zapotrzebowanie kaloryczne wg celu</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">Odchudzanie (−500 kcal/dzień)</h4>
                  <p className="text-sm text-muted-foreground">
                    Deficyt kaloryczny 500 kcal dziennie pozwala tracić około 0,45 kg tygodniowo. 
                    To bezpieczne i zrównoważone tempo redukcji, które minimalizuje utratę masy mięśniowej. 
                    Zaleca się wyższe spożycie białka (35% kalorii) i regularne ćwiczenia siłowe.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2 text-orange-600 dark:text-orange-400">Wolna redukcja (−250 kcal/dzień)</h4>
                  <p className="text-sm text-muted-foreground">
                    Łagodniejszy deficyt kaloryczny, idealny dla osób aktywnych fizycznie lub 
                    początkujących. Pozwala tracić około 0,23 kg tygodniowo, zachowując energię 
                    na treningi i codzienne aktywności.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2 text-green-600 dark:text-green-400">Utrzymanie wagi (0 kcal)</h4>
                  <p className="text-sm text-muted-foreground">
                    Spożywanie kalorii na poziomie TDEE utrzymuje obecną masę ciała. 
                    Idealne dla osób zadowolonych ze swojej wagi, które chcą utrzymać zdrowy 
                    tryb życia i optymalną wydolność fizyczną.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-600 dark:text-blue-400">Czysta masa (+250 kcal/dzień)</h4>
                  <p className="text-sm text-muted-foreground">
                    Lekka nadwyżka kaloryczna pozwala budować masę mięśniową przy minimalnym 
                    przyroście tkanki tłuszczowej. Wymaga regularnych treningów siłowych 
                    i odpowiedniego spożycia białka (minimum 1,6-2,2 g/kg masy ciała).
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2 text-indigo-600 dark:text-indigo-400">Budowa masy (+500 kcal/dzień)</h4>
                  <p className="text-sm text-muted-foreground">
                    Większa nadwyżka kaloryczna dla szybszego przyrostu masy. Zalecana dla 
                    osób szczupłych, początkujących na siłowni lub sportowców wymagających 
                    dużych zasobów energetycznych. Ważne jest uzupełnianie nadwyżki z wartościowych źródeł.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Makroskładniki - co oznaczają wyniki?</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left">Makroskładnik</th>
                      <th className="border p-3 text-left">Kalorie/gram</th>
                      <th className="border p-3 text-left">Rola w organizmie</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3 font-medium">Białko</td>
                      <td className="border p-3 font-mono">4 kcal/g</td>
                      <td className="border p-3 text-sm">Budowa i regeneracja mięśni, enzymy, hormony, odporność</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Węglowodany</td>
                      <td className="border p-3 font-mono">4 kcal/g</td>
                      <td className="border p-3 text-sm">Główne źródło energii, paliwo dla mózgu i mięśni</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Tłuszcze</td>
                      <td className="border p-3 font-mono">9 kcal/g</td>
                      <td className="border p-3 text-sm">Hormony, wchłanianie witamin, ochrona narządów, energia</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Wskazówki dotyczące zdrowego odżywiania</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Jedz regularnie</strong> - 3-5 posiłków dziennie w stałych odstępach czasu</li>
                <li><strong>Białko w każdym posiłku</strong> - pomaga utrzymać masę mięśniową i sytość</li>
                <li><strong>Pij wodę</strong> - minimum 2 litry dziennie, więcej przy aktywności fizycznej</li>
                <li><strong>Jedz warzywa i owoce</strong> - bogate w błonnik, witaminy i minerały</li>
                <li><strong>Wybieraj pełnoziarniste</strong> - chleb, makaron, ryż - dostarczają wolno trawionych węglowodanów</li>
                <li><strong>Zdrowe tłuszcze</strong> - oliwa z oliwek, orzechy, awokado, ryby</li>
                <li><strong>Ogranicz cukier i przetworzoną żywność</strong> - „puste" kalorie bez wartości odżywczej</li>
                <li><strong>Nie głodź się</strong> - drastyczne diety spowalniają metabolizm i prowadzą do efektu jo-jo</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Często zadawane pytania</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czym różni się BMR od TDEE?</h4>
                  <p className="text-sm text-muted-foreground">
                    BMR to kalorie spalane w stanie całkowitego spoczynku (leżąc w łóżku cały dzień). 
                    TDEE to BMR powiększone o kalorie spalane podczas aktywności fizycznej, trawienia 
                    i codziennych czynności. Do planowania diety zawsze używamy TDEE, nie BMR.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jak dokładny jest kalkulator kalorii?</h4>
                  <p className="text-sm text-muted-foreground">
                    Formuła Mifflin-St Jeor ma dokładność około ±10% w porównaniu z pomiarami 
                    laboratoryjnymi. Wynik powinien być traktowany jako punkt wyjścia - obserwuj 
                    swoją wagę przez 2-3 tygodnie i dostosuj kalorie w górę lub w dół o 100-200 kcal.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Ile białka powinienem jeść?</h4>
                  <p className="text-sm text-muted-foreground">
                    Dla osób aktywnych fizycznie zaleca się 1,6-2,2 g białka na kg masy ciała dziennie. 
                    Przy odchudzaniu warto zwiększyć spożycie białka do 2,0-2,4 g/kg, aby chronić 
                    masę mięśniową podczas deficytu kalorycznego.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy mogę jeść poniżej BMR?</h4>
                  <p className="text-sm text-muted-foreground">
                    Nie jest to zalecane. Jedzenie poniżej BMR przez dłuższy czas spowalnia 
                    metabolizm, prowadzi do utraty masy mięśniowej, niedoborów witamin i minerałów, 
                    zmęczenia i pogorszenia samopoczucia. Bezpieczny deficyt to 300-500 kcal poniżej TDEE.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jak wybrać odpowiedni poziom aktywności?</h4>
                  <p className="text-sm text-muted-foreground">
                    Większość osób przeszacowuje swoją aktywność. Jeśli pracujesz przy biurku 
                    i ćwiczysz 3 razy w tygodniu po 45 minut, wybierz &quot;Lekko aktywny&quot; lub 
                    &quot;Umiarkowanie aktywny&quot;. &quot;Bardzo aktywny&quot; to osoby trenujące intensywnie 
                    niemal codziennie.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz kalkulator kalorii działa całkowicie w przeglądarce. Nie wymaga 
                rejestracji ani wysyłania danych. Wszystkie obliczenia wykonywane są 
                lokalnie na Twoim urządzeniu. Wyniki mają charakter orientacyjny - 
                w przypadku wątpliwości skonsultuj się z dietetykiem.
              </p>
            </div>
          </section>
        );
      case "blood-type-calculator":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Kalkulator Grupy Krwi Online - Oblicz Grupę Krwi Dziecka
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy kalkulator grupy krwi pozwala obliczyć prawdopodobną grupę 
                  krwi dziecka na podstawie grup krwi obojga rodziców. Kalkulator uwzględnia 
                  zarówno system ABO (grupy A, B, AB, O), jak i czynnik Rh (+ i -), 
                  korzystając z zasad genetyki mendlowskiej i tablicy Punnetta.
                </p>
                <p>
                  Grupa krwi jest dziedziczona po rodzicach i pozostaje niezmienna przez 
                  całe życie. Znajomość grupy krwi jest istotna w kontekście transfuzji 
                  krwi, ciąży oraz diagnostyki medycznej.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Jak działa dziedziczenie grupy krwi?
              </h2>
              <div className="text-muted-foreground space-y-4">
                <h3 className="text-lg font-semibold text-foreground">System ABO</h3>
                <p>
                  System ABO opiera się na trzech allelach: A, B i O. Każdy człowiek 
                  dziedziczy po jednym allelu od każdego z rodziców. Allele A i B są 
                  dominujące nad O, natomiast A i B są kodominujące względem siebie.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Grupa A</strong> - genotyp AA lub AO</li>
                  <li><strong>Grupa B</strong> - genotyp BB lub BO</li>
                  <li><strong>Grupa AB</strong> - genotyp AB (kodominacja)</li>
                  <li><strong>Grupa O</strong> - genotyp OO (allel recesywny)</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6">Czynnik Rh</h3>
                <p>
                  Czynnik Rh (Rhesus) jest określany przez obecność antygenu D na 
                  powierzchni czerwonych krwinek. Allel D (Rh+) jest dominujący nad 
                  allelem d (Rh-). Osoba Rh+ może mieć genotyp DD lub Dd, natomiast 
                  osoba Rh- ma genotyp dd.
                </p>
                <p>
                  To oznacza, że dwoje rodziców Rh+ może mieć dziecko Rh-, jeśli oboje 
                  są nosicielami allelu d (genotyp Dd).
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Najczęściej zadawane pytania
              </h2>
              <div className="text-muted-foreground space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Czy dwoje rodziców z grupą O może mieć dziecko z inną grupą?
                </h3>
                <p>
                  Nie. Jeśli oboje rodzice mają grupę O (genotyp OO), dziecko zawsze 
                  odziedziczy allel O od każdego rodzica, więc będzie miało grupę O.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-4">
                  Czy rodzice z grupami A i B mogą mieć dziecko z grupą O?
                </h3>
                <p>
                  Tak! Jeśli rodzic z grupą A ma genotyp AO, a rodzic z grupą B ma 
                  genotyp BO, istnieje 25% szans, że dziecko odziedziczy allel O od 
                  każdego rodzica i będzie miało grupę O.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-4">
                  Co to jest konflikt serologiczny?
                </h3>
                <p>
                  Konflikt serologiczny (konflikt Rh) może wystąpić, gdy matka jest Rh-, 
                  a dziecko Rh+. W takiej sytuacji organizm matki może wytworzyć 
                  przeciwciała przeciwko krwinkom dziecka. Dlatego ważne jest, aby 
                  kobiety Rh- w ciąży były pod specjalną opieką medyczną.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-4">
                  Jakie grupy krwi mogą oddawać krew komu?
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>O-</strong> - uniwersalny dawca (może oddać każdemu)</li>
                  <li><strong>AB+</strong> - uniwersalny biorca (może otrzymać od każdego)</li>
                  <li><strong>A+</strong> - może oddać dla A+ i AB+</li>
                  <li><strong>B+</strong> - może oddać dla B+ i AB+</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Tabela dziedziczenia grup krwi
              </h2>
              <div className="text-muted-foreground space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold text-foreground">Rodzic 1</th>
                        <th className="text-left p-2 font-semibold text-foreground">Rodzic 2</th>
                        <th className="text-left p-2 font-semibold text-foreground">Możliwe grupy dziecka</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="p-2">O</td><td className="p-2">O</td><td className="p-2">O</td></tr>
                      <tr><td className="p-2">O</td><td className="p-2">A</td><td className="p-2">O, A</td></tr>
                      <tr><td className="p-2">O</td><td className="p-2">B</td><td className="p-2">O, B</td></tr>
                      <tr><td className="p-2">O</td><td className="p-2">AB</td><td className="p-2">A, B</td></tr>
                      <tr><td className="p-2">A</td><td className="p-2">A</td><td className="p-2">O, A</td></tr>
                      <tr><td className="p-2">A</td><td className="p-2">B</td><td className="p-2">O, A, B, AB</td></tr>
                      <tr><td className="p-2">A</td><td className="p-2">AB</td><td className="p-2">A, B, AB</td></tr>
                      <tr><td className="p-2">B</td><td className="p-2">B</td><td className="p-2">O, B</td></tr>
                      <tr><td className="p-2">B</td><td className="p-2">AB</td><td className="p-2">A, B, AB</td></tr>
                      <tr><td className="p-2">AB</td><td className="p-2">AB</td><td className="p-2">A, B, AB</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm">
                  Powyższa tabela przedstawia uproszczone zestawienie możliwych grup krwi 
                  dziecka w systemie ABO (bez uwzględnienia czynnika Rh). Nasz kalkulator 
                  uwzględnia również czynnik Rh i podaje dokładne prawdopodobieństwa.
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz kalkulator grupy krwi działa całkowicie w przeglądarce. Nie wymaga 
                rejestracji ani wysyłania danych. Wszystkie obliczenia wykonywane są 
                lokalnie na Twoim urządzeniu. Wyniki mają charakter informacyjny i nie 
                zastępują profesjonalnej diagnostyki medycznej.
              </p>
            </div>
          </section>
        );
      case "inflation-calculator":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Kalkulator Inflacji Online - Oblicz Siłę Nabywczą Pieniądza
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy kalkulator inflacji pozwala obliczyć, jak inflacja wpływa 
                  na wartość Twoich pieniędzy w czasie. Sprawdź, ile będą warte Twoje 
                  oszczędności za 5, 10, 20 czy 30 lat przy obecnym poziomie inflacji. 
                  Kalkulator wykorzystuje wzór procentu składanego, który dokładnie 
                  odzwierciedla rzeczywisty wpływ inflacji na siłę nabywczą.
                </p>
                <p>
                  Inflacja to wzrost ogólnego poziomu cen dóbr i usług w gospodarce. 
                  Oznacza to, że za tę samą kwotę pieniędzy z biegiem czasu możesz kupić 
                  coraz mniej. Nasz kalkulator pomoże Ci zrozumieć skalę tego zjawiska 
                  i podjąć lepsze decyzje finansowe.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Jak działa inflacja?
              </h2>
              <div className="text-muted-foreground space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Wzór na inflację (procent składany)</h3>
                <p>
                  Kalkulator wykorzystuje wzór procentu składanego do obliczenia przyszłej 
                  wartości pieniądza:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg text-center font-mono text-foreground">
                  Wartość przyszła = Kwota × (1 + stopa inflacji / 100)<sup>liczba lat</sup>
                </div>
                <p>
                  Na przykład: 1000 zł przy rocznej inflacji 5% po 10 latach będzie 
                  odpowiadać sile nabywczej ok. 1629 zł. Oznacza to, że za to, co dziś 
                  kosztuje 1000 zł, za 10 lat zapłacisz ok. 1629 zł - utracisz prawie 
                  63% siły nabywczej.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6">Inflacja w Polsce</h3>
                <p>
                  Inflacja w Polsce jest mierzona przez Główny Urząd Statystyczny (GUS) 
                  za pomocą wskaźnika CPI (Consumer Price Index). Historycznie inflacja 
                  w Polsce wahała się od ujemnych wartości (deflacja) do dwucyfrowych 
                  poziomów. Cel inflacyjny Narodowego Banku Polskiego wynosi 2,5% z 
                  dopuszczalnym odchyleniem ±1 punkt procentowy.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Średnia inflacja w Polsce (2010-2020): ok. 1,5% rocznie</li>
                  <li>Inflacja w 2022: ponad 14% (najwyższa od lat 90.)</li>
                  <li>Cel inflacyjny NBP: 2,5% (±1 pp)</li>
                  <li>Inflacja w krajach strefy euro: cel EBC to ok. 2%</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Jak chronić oszczędności przed inflacją?
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Trzymanie pieniędzy na koncie oszczędnościowym przy niskim oprocentowaniu 
                  oznacza realną utratę ich wartości. Oto popularne sposoby ochrony 
                  oszczędności:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong>Obligacje skarbowe indeksowane inflacją</strong> - ich 
                    oprocentowanie jest powiązane z poziomem inflacji, co chroni realną 
                    wartość kapitału.
                  </li>
                  <li>
                    <strong>Lokaty bankowe</strong> - wybieraj lokaty z oprocentowaniem 
                    wyższym niż inflacja. Porównuj oferty różnych banków.
                  </li>
                  <li>
                    <strong>Inwestycje w akcje/ETF</strong> - historycznie rynki akcji 
                    generowały zwroty powyżej inflacji w długim terminie.
                  </li>
                  <li>
                    <strong>Nieruchomości</strong> - wartość nieruchomości zazwyczaj rośnie 
                    wraz z inflacją, a wynajem generuje dochód pasywny.
                  </li>
                  <li>
                    <strong>Złoto i metale szlachetne</strong> - tradycyjnie uważane za 
                    zabezpieczenie przed inflacją.
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Najczęściej zadawane pytania
              </h2>
              <div className="text-muted-foreground space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Czym jest siła nabywcza pieniądza?
                </h3>
                <p>
                  Siła nabywcza to ilość dóbr i usług, które można kupić za określoną 
                  kwotę pieniędzy. Gdy inflacja rośnie, siła nabywcza spada - za te same 
                  pieniądze kupisz mniej.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-4">
                  Jaka jest różnica między inflacją a deflacją?
                </h3>
                <p>
                  Inflacja oznacza wzrost cen (utratę wartości pieniądza), a deflacja to 
                  spadek cen (wzrost wartości pieniądza). Deflacja wydaje się korzystna, 
                  ale może prowadzić do stagnacji gospodarczej.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-4">
                  Co to jest wartość nominalna a realna?
                </h3>
                <p>
                  Wartość nominalna to kwota zapisana na banknocie lub kontrakcie. Wartość 
                  realna uwzględnia inflację i odzwierciedla faktyczną siłę nabywczą. 
                  Na przykład: pensja 5000 zł nominalnie to ta sama kwota, ale jej 
                  wartość realna spada co roku o stopę inflacji.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-4">
                  Jak inflacja wpływa na kredyty?
                </h3>
                <p>
                  Inflacja paradoksalnie pomaga kredytobiorcom - wartość realna długu 
                  maleje z czasem. Jeśli masz kredyt hipoteczny o stałym oprocentowaniu, 
                  inflacja sprawia, że raty stanowią coraz mniejszą część Twoich dochodów 
                  (zakładając, że zarobki rosną wraz z inflacją).
                </p>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz kalkulator inflacji działa całkowicie w przeglądarce. Nie wymaga 
                rejestracji ani wysyłania danych. Wszystkie obliczenia wykonywane są 
                lokalnie na Twoim urządzeniu. Wyniki mają charakter informacyjny i nie 
                stanowią porady finansowej.
              </p>
            </div>
          </section>
        );
      case "dog-years-calculator":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Psie Lata na Ludzkie - Przelicz Wiek Swojego Psa
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy kalkulator psich lat pozwala dokładnie przeliczyć wiek 
                  Twojego psa na ludzkie lata. W przeciwieństwie do popularnego mitu 
                  &quot;pomnóż przez 7&quot;, nasz kalkulator wykorzystuje nowoczesną, 
                  naukowo potwierdzoną formułę, która uwzględnia rozmiar psa i nieliniowy 
                  charakter procesu starzenia się.
                </p>
                <p>
                  Psy nie starzeją się w równym tempie przez całe życie. Pierwszy rok 
                  życia psa odpowiada aż 15 ludzkim latom, a duże psy starzeją się 
                  szybciej niż małe. Dlatego prosty mnożnik &quot;×7&quot; jest bardzo 
                  niedokładny.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Dlaczego &quot;pomnóż przez 7&quot; to mit?
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Zasada &quot;1 rok psa = 7 ludzkich lat&quot; została wymyślona jako 
                  uproszczenie, ale nie ma naukowego uzasadnienia. W rzeczywistości:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong>Pierwszy rok życia psa</strong> to okres ogromnego rozwoju - 
                    odpowiada ok. 15 ludzkim latom. Roczny pies jest już dojrzały 
                    reprodukcyjnie.
                  </li>
                  <li>
                    <strong>Drugi rok</strong> dodaje kolejnych ~9 ludzkich lat. 
                    Dwuletni pies odpowiada więc ok. 24-letniemu człowiekowi.
                  </li>
                  <li>
                    <strong>Kolejne lata</strong> dodają od 4 do 8 ludzkich lat rocznie, 
                    w zależności od rozmiaru psa.
                  </li>
                </ul>
                <p>
                  Badania przeprowadzone przez University of California San Diego w 2019 
                  roku, oparte na analizie DNA (metylacja), potwierdziły, że starzenie się 
                  psów jest procesem nieliniowym.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Jak rozmiar psa wpływa na starzenie?
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Rozmiar psa ma ogromny wpływ na tempo starzenia i średnią długość życia:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold text-foreground">Rozmiar</th>
                        <th className="text-left p-2 font-semibold text-foreground">Waga</th>
                        <th className="text-left p-2 font-semibold text-foreground">Lat/rok (po 2. roku)</th>
                        <th className="text-left p-2 font-semibold text-foreground">Średnia długość życia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr><td className="p-2">Mały</td><td className="p-2">&lt;10 kg</td><td className="p-2">+4 lata</td><td className="p-2">12-16 lat</td></tr>
                      <tr><td className="p-2">Średni</td><td className="p-2">10-25 kg</td><td className="p-2">+5 lat</td><td className="p-2">10-14 lat</td></tr>
                      <tr><td className="p-2">Duży</td><td className="p-2">25-45 kg</td><td className="p-2">+6 lat</td><td className="p-2">8-12 lat</td></tr>
                      <tr><td className="p-2">Olbrzymi</td><td className="p-2">&gt;45 kg</td><td className="p-2">+8 lat</td><td className="p-2">6-10 lat</td></tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  Paradoksalnie, większe psy żyją krócej niż mniejsze. Naukowcy uważają, 
                  że jest to związane z szybszym wzrostem dużych ras, co przyspiesza 
                  procesy starzenia na poziomie komórkowym.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Etapy życia psa
              </h2>
              <div className="text-muted-foreground space-y-4">
                <ul className="list-disc list-inside space-y-3 ml-2">
                  <li>
                    <strong>Szczeniak (0-12 ludzkich lat)</strong> - intensywny wzrost 
                    i rozwój. Pies uczy się podstawowych zachowań, wymaga socjalizacji 
                    i szczepień.
                  </li>
                  <li>
                    <strong>Młody (12-24 ludzkich lat)</strong> - dojrzewanie. Pies jest 
                    pełen energii, potrzebuje dużo ruchu i treningu.
                  </li>
                  <li>
                    <strong>Dorosły (24-40+ ludzkich lat)</strong> - pełna dojrzałość. 
                    Pies jest spokojniejszy, ale nadal aktywny. Regularne badania 
                    weterynaryjne raz w roku.
                  </li>
                  <li>
                    <strong>Senior (40-65+ ludzkich lat)</strong> - spowolnienie tempa 
                    życia. Mogą pojawiać się problemy ze stawami, wzrokiem i słuchem. 
                    Badania weterynaryjne co 6 miesięcy.
                  </li>
                  <li>
                    <strong>Wiekowy (65+ ludzkich lat)</strong> - wymaga szczególnej 
                    opieki, dostosowanej diety i regularnych wizyt u weterynarza. 
                    Komfort i jakość życia są priorytetem.
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Najczęściej zadawane pytania
              </h2>
              <div className="text-muted-foreground space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Ile ludzkich lat ma 5-letni pies?
                </h3>
                <p>
                  To zależy od rozmiaru! 5-letni mały pies to ok. 36 ludzkich lat, 
                  średni to ok. 39 lat, duży to ok. 42 lata, a olbrzymi to ok. 48 
                  ludzkich lat. Użyj naszego kalkulatora, aby uzyskać dokładny wynik.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-4">
                  Które rasy psów żyją najdłużej?
                </h3>
                <p>
                  Najdłużej żyją małe rasy: Chihuahua (15-20 lat), Jack Russell Terrier 
                  (13-16 lat), Yorkshire Terrier (13-16 lat), Shih Tzu (10-16 lat). 
                  Rekordzistą jest australijski pies pasterski Bluey, który dożył 29 lat.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-4">
                  Od jakiego wieku pies jest seniorem?
                </h3>
                <p>
                  Małe psy stają się seniorami ok. 10-11 roku życia, średnie ok. 8-9 
                  roku, duże ok. 6-7 roku, a olbrzymie już ok. 5 roku życia. Im większy 
                  pies, tym wcześniej wchodzi w etap senioralny.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-4">
                  Jak mogę pomóc mojemu psu żyć dłużej?
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Zbilansowana dieta dostosowana do wieku i rozmiaru</li>
                  <li>Regularna aktywność fizyczna</li>
                  <li>Profilaktyczne badania weterynaryjne</li>
                  <li>Utrzymywanie zdrowej wagi (otyłość skraca życie!)</li>
                  <li>Higiena jamy ustnej</li>
                  <li>Stymulacja umysłowa (zabawy, szkolenie)</li>
                </ul>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz kalkulator psich lat działa całkowicie w przeglądarce. Nie wymaga 
                rejestracji ani wysyłania danych. Wyniki oparte są na danych 
                weterynaryjnych i mają charakter orientacyjny - każdy pies starzeje się 
                indywidualnie.
              </p>
            </div>
          </section>
        );
      case "roman-numerals":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Kalkulator Cyfr Rzymskich Online - Konwerter Liczb
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy kalkulator cyfr rzymskich pozwala błyskawicznie przeliczać 
                  liczby arabskie na rzymskie i odwrotnie. Wystarczy wpisać liczbę od 1 do 
                  3999 lub cyfrę rzymską, aby natychmiast zobaczyć wynik konwersji.
                </p>
                <p>
                  Cyfry rzymskie to system zapisu liczb stworzony w starożytnym Rzymie. 
                  Mimo że mają ponad 2000 lat, są nadal powszechnie używane - na zegarach, 
                  w tytułach filmów, numeracji rozdziałów, oznaczeniach wieków i wielu 
                  innych miejscach.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">7 podstawowych symboli</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-center">Symbol</th>
                      <th className="border p-3 text-center">I</th>
                      <th className="border p-3 text-center">V</th>
                      <th className="border p-3 text-center">X</th>
                      <th className="border p-3 text-center">L</th>
                      <th className="border p-3 text-center">C</th>
                      <th className="border p-3 text-center">D</th>
                      <th className="border p-3 text-center">M</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border p-3 text-center font-medium">Wartość</td>
                      <td className="border p-3 text-center">1</td>
                      <td className="border p-3 text-center">5</td>
                      <td className="border p-3 text-center">10</td>
                      <td className="border p-3 text-center">50</td>
                      <td className="border p-3 text-center">100</td>
                      <td className="border p-3 text-center">500</td>
                      <td className="border p-3 text-center">1000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Jak działa zapis subtraktywny?</h3>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Liczby tworzy się przez dodawanie wartości symboli od lewej do prawej. 
                  Jeśli jednak mniejszy symbol stoi przed większym, jego wartość jest 
                  odejmowana. To tak zwany zapis subtraktywny:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Zapis subtraktywny</h4>
                    <ul className="text-sm space-y-1">
                      <li><strong>IV</strong> = 5 - 1 = <strong>4</strong></li>
                      <li><strong>IX</strong> = 10 - 1 = <strong>9</strong></li>
                      <li><strong>XL</strong> = 50 - 10 = <strong>40</strong></li>
                      <li><strong>XC</strong> = 100 - 10 = <strong>90</strong></li>
                      <li><strong>CD</strong> = 500 - 100 = <strong>400</strong></li>
                      <li><strong>CM</strong> = 1000 - 100 = <strong>900</strong></li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Przykłady</h4>
                    <ul className="text-sm space-y-1">
                      <li><strong>III</strong> = 1+1+1 = <strong>3</strong></li>
                      <li><strong>XIV</strong> = 10+4 = <strong>14</strong></li>
                      <li><strong>XLII</strong> = 40+2 = <strong>42</strong></li>
                      <li><strong>MCMXCIX</strong> = 1000+900+90+9 = <strong>1999</strong></li>
                      <li><strong>MMXXIV</strong> = 2000+20+4 = <strong>2024</strong></li>
                      <li><strong>MMMCMXCIX</strong> = <strong>3999</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Tabela cyfr rzymskich 1-100</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2">Arabska</th>
                      <th className="border p-2">Rzymska</th>
                      <th className="border p-2">Arabska</th>
                      <th className="border p-2">Rzymska</th>
                      <th className="border p-2">Arabska</th>
                      <th className="border p-2">Rzymska</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 text-center">1</td><td className="border p-2 text-center font-medium">I</td>
                      <td className="border p-2 text-center">10</td><td className="border p-2 text-center font-medium">X</td>
                      <td className="border p-2 text-center">100</td><td className="border p-2 text-center font-medium">C</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">2</td><td className="border p-2 text-center font-medium">II</td>
                      <td className="border p-2 text-center">20</td><td className="border p-2 text-center font-medium">XX</td>
                      <td className="border p-2 text-center">200</td><td className="border p-2 text-center font-medium">CC</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">3</td><td className="border p-2 text-center font-medium">III</td>
                      <td className="border p-2 text-center">30</td><td className="border p-2 text-center font-medium">XXX</td>
                      <td className="border p-2 text-center">500</td><td className="border p-2 text-center font-medium">D</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">4</td><td className="border p-2 text-center font-medium">IV</td>
                      <td className="border p-2 text-center">40</td><td className="border p-2 text-center font-medium">XL</td>
                      <td className="border p-2 text-center">1000</td><td className="border p-2 text-center font-medium">M</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">5</td><td className="border p-2 text-center font-medium">V</td>
                      <td className="border p-2 text-center">50</td><td className="border p-2 text-center font-medium">L</td>
                      <td className="border p-2 text-center">2000</td><td className="border p-2 text-center font-medium">MM</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">6</td><td className="border p-2 text-center font-medium">VI</td>
                      <td className="border p-2 text-center">60</td><td className="border p-2 text-center font-medium">LX</td>
                      <td className="border p-2 text-center">2024</td><td className="border p-2 text-center font-medium">MMXXIV</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">7</td><td className="border p-2 text-center font-medium">VII</td>
                      <td className="border p-2 text-center">70</td><td className="border p-2 text-center font-medium">LXX</td>
                      <td className="border p-2 text-center">2026</td><td className="border p-2 text-center font-medium">MMXXVI</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">8</td><td className="border p-2 text-center font-medium">VIII</td>
                      <td className="border p-2 text-center">80</td><td className="border p-2 text-center font-medium">LXXX</td>
                      <td className="border p-2 text-center">3000</td><td className="border p-2 text-center font-medium">MMM</td>
                    </tr>
                    <tr>
                      <td className="border p-2 text-center">9</td><td className="border p-2 text-center font-medium">IX</td>
                      <td className="border p-2 text-center">90</td><td className="border p-2 text-center font-medium">XC</td>
                      <td className="border p-2 text-center">3999</td><td className="border p-2 text-center font-medium">MMMCMXCIX</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Gdzie dziś używamy cyfr rzymskich?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Zegary i zegarki</h4>
                  <p className="text-sm text-muted-foreground">
                    Klasyczne tarcze zegarowe używają cyfr rzymskich. Co ciekawe, 
                    liczba 4 jest często zapisywana jako IIII zamiast IV.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Filmy i seriale</h4>
                  <p className="text-sm text-muted-foreground">
                    Rok produkcji w napisach końcowych filmów jest tradycyjnie 
                    zapisywany cyframi rzymskimi, np. MMXXIV (2024).
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Monarchowie i papieże</h4>
                  <p className="text-sm text-muted-foreground">
                    Numery porządkowe władców zapisuje się cyframi rzymskimi: 
                    Jan Paweł II, Elżbieta II, Ludwik XIV.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Wieki i stulecia</h4>
                  <p className="text-sm text-muted-foreground">
                    W języku polskim wieki oznaczamy cyframi rzymskimi: 
                    XXI wiek, XV wiek, III wiek p.n.e.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Super Bowl i olimpiady</h4>
                  <p className="text-sm text-muted-foreground">
                    Edycje Super Bowl są numerowane cyframi rzymskimi 
                    (np. Super Bowl LVIII = 58). Olimpiady również stosują ten zapis.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Rozdziały i konspekty</h4>
                  <p className="text-sm text-muted-foreground">
                    W książkach, pracach naukowych i dokumentach rozdziały 
                    i sekcje często numeruje się cyframi rzymskimi (I, II, III...).
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Często zadawane pytania</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Dlaczego maksymalna liczba to 3999?</h4>
                  <p className="text-sm text-muted-foreground">
                    W standardowym zapisie rzymskim najwyższym symbolem jest M (1000). 
                    Maksymalnie można powtórzyć go trzykrotnie (MMM = 3000), a z resztą 
                    symboli utworzyć MMMCMXCIX = 3999. Nie ma standardowego symbolu 
                    dla 5000 ani wyżej, choć w starożytności stosowano specjalne oznaczenia.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jak zapisać 4 po rzymsku - IV czy IIII?</h4>
                  <p className="text-sm text-muted-foreground">
                    Poprawny współczesny zapis to IV (zapis subtraktywny). Jednak na 
                    zegarach często spotykamy IIII zamiast IV. Istnieje kilka teorii - 
                    symetria z VIII po drugiej stronie tarczy, czytelność, a także 
                    tradycja sięgająca starożytnego Rzymu, gdzie oba zapisy były dopuszczalne.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy Rzymianie znali zero?</h4>
                  <p className="text-sm text-muted-foreground">
                    Nie. System rzymski nie posiada symbolu dla zera. Koncepcja zera jako 
                    liczby dotarła do Europy z systemu hindusko-arabskiego dopiero 
                    w średniowieczu. Dlatego nasz kalkulator obsługuje zakres od 1 do 3999.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jaka jest największa liczba w cyfrach rzymskich?</h4>
                  <p className="text-sm text-muted-foreground">
                    W standardowym zapisie to MMMCMXCIX = 3999. Jednak Rzymianie stosowali 
                    nadkreślenia (vinculum) do mnożenia przez 1000, co pozwalało zapisywać 
                    znacznie większe liczby. Np. V z kreską nad spodem oznaczało 5000.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz kalkulator cyfr rzymskich działa całkowicie w przeglądarce. 
                Nie wymaga rejestracji ani wysyłania danych. Wszystkie konwersje 
                wykonywane są lokalnie na Twoim urządzeniu.
              </p>
            </div>
          </section>
        );
      case "cat-years-calculator":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Kocie Lata na Ludzkie - Ile Naprawdę Lat Ma Twój Kot?
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy kalkulator kocich lat pozwala dokładnie przeliczyć wiek 
                  Twojego kota na ludzkie lata. W przeciwieństwie do popularnego mitu 
                  &quot;pomnóż przez 7&quot;, nasz kalkulator wykorzystuje nowoczesną, 
                  naukowo potwierdzoną nieliniową formułę, która uwzględnia fakt, że koty 
                  starzeją się najszybciej w pierwszych dwóch latach życia.
                </p>
                <p>
                  Pierwszy rok życia kota odpowiada aż 15 ludzkim latom, a dwuletni kot 
                  to odpowiednik 24-letniego człowieka. Po drugim roku każdy kolejny rok 
                  kota dodaje około 4 ludzkie lata. Dlatego prosty mnożnik &quot;×7&quot; 
                  jest bardzo niedokładny.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Dlaczego mnożenie przez 7 nie działa?</h3>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Mit o mnożeniu przez 7 sugeruje, że roczny kot to odpowiednik 7-letniego 
                  człowieka. W rzeczywistości roczny kot jest już dojrzały reprodukcyjnie, 
                  co odpowiada raczej 15-letniemu nastolatkowi. Koty dojrzewają znacznie 
                  szybciej niż ludzie w pierwszych latach, a potem starzenie zwalnia.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Tabela przeliczania kocich lat</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-center">Wiek kota</th>
                      <th className="border p-3 text-center">Ludzkie lata</th>
                      <th className="border p-3 text-center">Etap życia</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr><td className="border p-3 text-center">0.5</td><td className="border p-3 text-center">7.5</td><td className="border p-3 text-center">Kociak</td></tr>
                    <tr><td className="border p-3 text-center">1</td><td className="border p-3 text-center">15</td><td className="border p-3 text-center">Junior</td></tr>
                    <tr><td className="border p-3 text-center">2</td><td className="border p-3 text-center">24</td><td className="border p-3 text-center">Junior</td></tr>
                    <tr><td className="border p-3 text-center">3</td><td className="border p-3 text-center">28</td><td className="border p-3 text-center">Dorosły</td></tr>
                    <tr><td className="border p-3 text-center">5</td><td className="border p-3 text-center">36</td><td className="border p-3 text-center">Dorosły</td></tr>
                    <tr><td className="border p-3 text-center">7</td><td className="border p-3 text-center">44</td><td className="border p-3 text-center">Dojrzały</td></tr>
                    <tr><td className="border p-3 text-center">10</td><td className="border p-3 text-center">56</td><td className="border p-3 text-center">Dojrzały</td></tr>
                    <tr><td className="border p-3 text-center">12</td><td className="border p-3 text-center">64</td><td className="border p-3 text-center">Senior</td></tr>
                    <tr><td className="border p-3 text-center">15</td><td className="border p-3 text-center">76</td><td className="border p-3 text-center">Wiekowy</td></tr>
                    <tr><td className="border p-3 text-center">18</td><td className="border p-3 text-center">88</td><td className="border p-3 text-center">Wiekowy</td></tr>
                    <tr><td className="border p-3 text-center">20</td><td className="border p-3 text-center">96</td><td className="border p-3 text-center">Wiekowy</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Etapy życia kota</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Kociak (0-6 miesięcy)</h4>
                  <p className="text-sm text-muted-foreground">
                    Intensywny wzrost i rozwój. Kociak uczy się podstawowych umiejętności, 
                    socjalizuje się i jest niezwykle aktywny. To okres szczepień i nauki.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Junior (6 mies. - 2 lata)</h4>
                  <p className="text-sm text-muted-foreground">
                    Kot osiąga dojrzałość płciową i pełny rozmiar. To &quot;nastoletni&quot; okres - 
                    pełen energii, zabawy i eksploracji. Idealny czas na sterylizację.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Dorosły (3-6 lat)</h4>
                  <p className="text-sm text-muted-foreground">
                    Kot w pełni sił. Aktywny, ale spokojniejszy niż w okresie juniorskim. 
                    Ustalone nawyki żywieniowe i zachowania. Regularne wizyty u weterynarza.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Dojrzały (7-10 lat)</h4>
                  <p className="text-sm text-muted-foreground">
                    Odpowiednik człowieka w średnim wieku (44-56 lat). Kot może zacząć 
                    przybierać na wadze i mniej się ruszać. Ważne badania profilaktyczne.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Senior (11-14 lat)</h4>
                  <p className="text-sm text-muted-foreground">
                    Odpowiednik 60-72 lat człowieka. Mogą pojawić się problemy zdrowotne - 
                    choroby nerek, nadczynność tarczycy, cukrzyca. Częstsze wizyty u weterynarza.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Wiekowy (15+ lat)</h4>
                  <p className="text-sm text-muted-foreground">
                    Kot wymaga szczególnej opieki. Może mieć problemy z mobilnością, 
                    wzrokiem i słuchem. Regularne badania co pół roku i dostosowana dieta.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Długość życia kota - co wpływa?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Kot domowy vs wychodzący</h4>
                  <p className="text-sm text-muted-foreground">
                    Koty domowe żyją średnio 12-18 lat, a niektóre nawet ponad 20 lat. 
                    Koty wychodzące na zewnątrz żyją znacznie krócej - średnio 5-10 lat - 
                    ze względu na zagrożenia (ruch drogowy, choroby, inne zwierzęta).
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Rasa a długowieczność</h4>
                  <p className="text-sm text-muted-foreground">
                    Koty mieszane (dachowce) często żyją dłużej niż rasowe dzięki większej 
                    różnorodności genetycznej. Najdłużej żyjące rasy to m.in. Syjamski, 
                    Burmański i Ragdoll (15-20 lat). Krótszą żywotność mają np. Persy.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Dieta i waga</h4>
                  <p className="text-sm text-muted-foreground">
                    Prawidłowa waga to klucz do długiego życia. Otyłość zwiększa ryzyko 
                    cukrzycy, chorób stawów i serca. Zbilansowana dieta z odpowiednią 
                    ilością białka i tauryny jest niezbędna.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Opieka weterynaryjna</h4>
                  <p className="text-sm text-muted-foreground">
                    Regularne szczepienia, odrobaczanie i kontrole profilaktyczne 
                    wydłużają życie kota. Sterylizacja/kastracja zmniejsza ryzyko 
                    nowotworów i eliminuje problemy behawioralne.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Często zadawane pytania</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Ile lat ludzkich ma roczny kot?</h4>
                  <p className="text-sm text-muted-foreground">
                    Roczny kot odpowiada 15 ludzkim latom. To już nie jest kociak, 
                    ale dojrzewający nastolatek. Dlatego roczne koty są już w pełni 
                    samodzielne i dojrzałe reprodukcyjnie.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jaki jest najstarszy kot w historii?</h4>
                  <p className="text-sm text-muted-foreground">
                    Najstarszym udokumentowanym kotem była Creme Puff z Austin w Teksasie, 
                    która dożyła 38 lat i 3 dni (1967-2005). To odpowiednik ponad 168 
                    ludzkich lat! Przeciętnie jednak koty żyją 12-18 lat.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy koty i psy starzeją się tak samo?</h4>
                  <p className="text-sm text-muted-foreground">
                    Nie. Koty starzeją się inaczej niż psy. Koty nie mają tak dużych różnic 
                    w starzeniu zależnych od rozmiaru jak psy (małe psy żyją dłużej niż duże). 
                    Koty ogólnie żyją dłużej niż psy - średnio 12-18 lat w porównaniu 
                    z 10-13 latami psa.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jak rozpoznać, że kot się starzeje?</h4>
                  <p className="text-sm text-muted-foreground">
                    Objawy starzenia to m.in.: mniejsza aktywność, więcej snu, 
                    utrata masy mięśniowej, siwienie sierści (szczególnie wokół pyska), 
                    zmiany apetytu, częstsze picie wody i mniejsza elastyczność stawów.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz kalkulator kocich lat działa całkowicie w przeglądarce. Nie wymaga 
                rejestracji ani wysyłania danych. Wyniki oparte są na danych 
                weterynaryjnych i mają charakter orientacyjny - każdy kot starzeje się 
                indywidualnie.
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
