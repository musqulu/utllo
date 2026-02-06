import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getToolsByCategory, getToolByCategoryAndSlug, categoryMeta, getToolUrl, getRelatedTools } from "@/lib/tools";
import { JsonLd, generateWebApplicationSchema, generateBreadcrumbSchema } from "@/components/seo/json-ld";
import { ToolPlaceholder } from "@/components/layout/tool-placeholder";

// Tool Components
import { GeneratorCard as PasswordGenerator } from "@/components/password-generator/generator-card";
import { LoremGenerator } from "@/components/lorem-ipsum/lorem-generator";
import { CharacterCounter } from "@/components/text-counter/character-counter";
import { WordCounter } from "@/components/text-counter/word-counter";
import { DiceRoller } from "@/components/dice/dice-roller";
import { FontGenerator } from "@/components/fonts/font-generator";
import { CountdownVacation } from "@/components/countdown/countdown-vacation";
import { CountdownChristmas } from "@/components/countdown/countdown-christmas";
import { CountdownDate } from "@/components/countdown/countdown-date";

const BASE_URL = "https://uttlo.com";
const CATEGORY = "tools";
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
  const toolDict = dict.tools[tool.id as keyof typeof dict.tools];
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
      case "password-generator":
        return <PasswordGenerator />;
      case "lorem-ipsum":
        return (
          <LoremGenerator
            dictionary={{
              paragraphs: (toolDict as any).paragraphs || "Akapity",
              sentences: (toolDict as any).sentences || "Zdania",
              words: (toolDict as any).words || "Słowa",
              count: (toolDict as any).count || "Ilość",
              generate: (toolDict as any).generate || "Generuj",
              copy: dict.common.copy,
              copied: dict.common.copied,
            }}
          />
        );
      case "character-counter":
        return (
          <CharacterCounter
            dictionary={{
              title: (toolDict as any).title || "Licznik Znaków",
              subtitle: (toolDict as any).subtitle || "Policz znaki, słowa i więcej w tekście",
              placeholder: (toolDict as any).placeholder || "Wpisz lub wklej tutaj swój tekst...",
              characters: (toolDict as any).characters || "Znaki",
              charactersNoSpaces: (toolDict as any).charactersNoSpaces || "Znaki (bez spacji)",
              words: (toolDict as any).words || "Słowa",
              sentences: (toolDict as any).sentences || "Zdania",
              paragraphs: (toolDict as any).paragraphs || "Akapity",
              readingTime: (toolDict as any).readingTime || "Czas czytania",
              speakingTime: (toolDict as any).speakingTime || "Czas mówienia",
              minutes: (toolDict as any).minutes || "min",
              seconds: (toolDict as any).seconds || "sek",
              clear: (toolDict as any).clear || "Wyczyść",
              copy: (toolDict as any).copy || "Kopiuj tekst",
            }}
          />
        );
      case "word-counter":
        return (
          <WordCounter
            dictionary={{
              title: (toolDict as any).title || "Licznik Słów",
              subtitle: (toolDict as any).subtitle || "Policz słowa i przeanalizuj tekst",
              placeholder: (toolDict as any).placeholder || "Wpisz lub wklej tutaj swój tekst...",
              words: (toolDict as any).words || "Słowa",
              uniqueWords: (toolDict as any).uniqueWords || "Unikalne słowa",
              characters: (toolDict as any).characters || "Znaki",
              sentences: (toolDict as any).sentences || "Zdania",
              paragraphs: (toolDict as any).paragraphs || "Akapity",
              avgWordLength: (toolDict as any).avgWordLength || "Średnia długość słowa",
              avgSentenceLength: (toolDict as any).avgSentenceLength || "Średnia długość zdania",
              readingTime: (toolDict as any).readingTime || "Czas czytania",
              speakingTime: (toolDict as any).speakingTime || "Czas mówienia",
              minutes: (toolDict as any).minutes || "min",
              seconds: (toolDict as any).seconds || "sek",
              wordsLabel: (toolDict as any).wordsLabel || "słów",
              clear: (toolDict as any).clear || "Wyczyść",
              copy: (toolDict as any).copy || "Kopiuj tekst",
              topWords: (toolDict as any).topWords || "Najczęstsze słowa",
            }}
          />
        );
      case "dice-roll":
        return (
          <DiceRoller
            dictionary={{
              title: (toolDict as any).title || "Rzut Kostką",
              subtitle: (toolDict as any).subtitle || "Wirtualna kostka do gry online",
              roll: (toolDict as any).roll || "Rzuć kostką",
              rolling: (toolDict as any).rolling || "Rzucam...",
              result: (toolDict as any).result || "Wynik",
              total: (toolDict as any).total || "Suma",
              numberOfDice: (toolDict as any).numberOfDice || "Liczba kostek",
              diceType: (toolDict as any).diceType || "Typ kostki",
              history: (toolDict as any).history || "Historia rzutów",
              clearHistory: (toolDict as any).clearHistory || "Wyczyść historię",
              sides: (toolDict as any).sides || "ścianek",
              average: (toolDict as any).average || "Średnia",
              min: (toolDict as any).min || "Min",
              max: (toolDict as any).max || "Max",
            }}
          />
        );
      case "font-generator":
        return (
          <FontGenerator
            dictionary={{
              title: (toolDict as any).title || "Generator Czcionek",
              subtitle: (toolDict as any).subtitle || "Podgląd tekstu w różnych czcionkach",
              placeholder: (toolDict as any).placeholder || "Wpisz swój tekst...",
              defaultText: (toolDict as any).defaultText || "Twój tekst tutaj",
              fontSize: (toolDict as any).fontSize || "Rozmiar czcionki",
              allFonts: (toolDict as any).allFonts || "Wszystkie czcionki",
              serif: (toolDict as any).serif || "Szeryfowe",
              sansSerif: (toolDict as any).sansSerif || "Bezszeryfowe",
              display: (toolDict as any).display || "Dekoracyjne",
              handwriting: (toolDict as any).handwriting || "Odręczne",
              monospace: (toolDict as any).monospace || "Monospace",
              copyFont: (toolDict as any).copyFont || "Kopiuj nazwę",
              copied: (toolDict as any).copied || "Skopiowano!",
              fontPairings: (toolDict as any).fontPairings || "Kombinacje czcionek",
              heading: (toolDict as any).heading || "Nagłówek",
              body: (toolDict as any).body || "Treść",
              searchFonts: (toolDict as any).searchFonts || "Szukaj czcionek...",
              noResults: (toolDict as any).noResults || "Nie znaleziono czcionek",
              googleFonts: (toolDict as any).googleFonts || "Google Fonts",
            }}
          />
        );
      case "countdown-vacation":
        return (
          <CountdownVacation
            dictionary={{
              title: (toolDict as any).title || "Odliczanie do Wakacji",
              subtitle: (toolDict as any).subtitle || "Ile czasu zostało do wakacji letnich?",
              days: (toolDict as any).days || "dni",
              hours: (toolDict as any).hours || "godzin",
              minutes: (toolDict as any).minutes || "minut",
              seconds: (toolDict as any).seconds || "sekund",
              vacationStart: (toolDict as any).vacationStart || "Początek wakacji",
              timeLeft: (toolDict as any).timeLeft || "Pozostało",
              vacationStarted: (toolDict as any).vacationStarted || "Wakacje już się zaczęły!",
              enjoy: (toolDict as any).enjoy || "Ciesz się wolnym czasem!",
            }}
          />
        );
      case "countdown-christmas":
        return (
          <CountdownChristmas
            dictionary={{
              title: (toolDict as any).title || "Odliczanie do Świąt",
              subtitle: (toolDict as any).subtitle || "Ile czasu zostało do Bożego Narodzenia?",
              days: (toolDict as any).days || "dni",
              hours: (toolDict as any).hours || "godzin",
              minutes: (toolDict as any).minutes || "minut",
              seconds: (toolDict as any).seconds || "sekund",
              christmasDate: (toolDict as any).christmasDate || "Wigilia Bożego Narodzenia",
              timeLeft: (toolDict as any).timeLeft || "Pozostało do Wigilii",
              christmasNow: (toolDict as any).christmasNow || "Wesołych Świąt!",
              merryChristmas: (toolDict as any).merryChristmas || "Świąteczny czas już nadszedł!",
            }}
          />
        );
      case "countdown-date":
        return (
          <CountdownDate
            dictionary={{
              title: (toolDict as any).title || "Odliczanie do Daty",
              subtitle: (toolDict as any).subtitle || "Odliczaj czas do dowolnego wydarzenia",
              days: (toolDict as any).days || "dni",
              hours: (toolDict as any).hours || "godzin",
              minutes: (toolDict as any).minutes || "minut",
              seconds: (toolDict as any).seconds || "sekund",
              selectDate: (toolDict as any).selectDate || "Wybierz datę",
              eventName: (toolDict as any).eventName || "Nazwa wydarzenia (opcjonalnie)",
              eventPlaceholder: (toolDict as any).eventPlaceholder || "np. Moje urodziny",
              timeLeft: (toolDict as any).timeLeft || "Pozostało",
              dateReached: (toolDict as any).dateReached || "Data już minęła!",
              timeSince: (toolDict as any).timeSince || "Od tego wydarzenia minęło",
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
      case "password-generator":
        return (
          <section className="max-w-2xl mx-auto mt-12 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Bezpieczny Generator Haseł Online
            </h2>
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                Nasz generator haseł tworzy silne i bezpieczne hasła bezpośrednio w
                Twojej przeglądarce. Hasła nie są nigdzie wysyłane ani zapisywane.
              </p>
              <p>
                Używamy kryptograficznie bezpiecznego generatora liczb losowych
                (crypto.getRandomValues) dla maksymalnego bezpieczeństwa Twoich haseł.
              </p>
              <p>
                Możesz dostosować długość hasła od 8 do 64 znaków oraz wybrać, jakie
                typy znaków mają być uwzględnione: wielkie litery, małe litery,
                cyfry i symbole specjalne.
              </p>
            </div>
          </section>
        );
      case "lorem-ipsum":
        return (
          <section className="max-w-2xl mx-auto mt-12 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Czym jest Lorem Ipsum?
            </h2>
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                Lorem Ipsum to standardowy tekst zastępczy używany w przemyśle
                poligraficznym i typograficznym od XVI wieku. Jest to zniekształcony
                fragment traktatu Cycerona &quot;De finibus bonorum et malorum&quot;.
              </p>
              <p>
                Nasz generator tworzy losowy tekst Lorem Ipsum w trzech formatach:
                akapity, zdania i pojedyncze słowa. Możesz dostosować ilość
                generowanego tekstu za pomocą suwaka.
              </p>
              <p>
                Tekst Lorem Ipsum jest powszechnie używany przez projektantów
                i deweloperów do wypełniania makiet i prototypów przed dodaniem
                właściwej treści.
              </p>
            </div>
          </section>
        );
      case "character-counter":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Licznik Znaków Online - Policz Znaki w Tekście
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy licznik znaków to idealne narzędzie do szybkiego zliczania znaków 
                  w dowolnym tekście. Czy piszesz SMS, tweet, meta description dla SEO, czy 
                  wypełniasz formularz z limitem znaków - nasz licznik pomoże Ci zmieścić się 
                  w wymaganych granicach.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Do czego służy licznik znaków?</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Media społecznościowe</strong> - Twitter (280 znaków), Instagram bio (150 znaków)</li>
                <li><strong>SEO</strong> - Meta title (60 znaków), meta description (160 znaków)</li>
                <li><strong>SMS</strong> - Sprawdź, czy wiadomość zmieści się w jednym SMS (160 znaków)</li>
                <li><strong>Formularze online</strong> - Wiele formularzy ma limity znaków</li>
                <li><strong>Copywriting</strong> - Kontroluj długość nagłówków i tekstów reklamowych</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Jak używać licznika znaków?</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Wpisz lub wklej tekst w pole tekstowe</li>
                <li>Wyniki aktualizują się automatycznie w czasie rzeczywistym</li>
                <li>Sprawdź liczbę znaków, słów, zdań i akapitów</li>
                <li>Zobacz szacowany czas czytania i mówienia</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Często zadawane pytania</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy spacje są liczone jako znaki?</h4>
                  <p className="text-sm text-muted-foreground">
                    Tak, nasz licznik pokazuje zarówno liczbę wszystkich znaków (ze spacjami), 
                    jak i liczbę znaków bez spacji. Dzięki temu możesz wybrać odpowiednią wartość 
                    w zależności od potrzeb.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jak obliczany jest czas czytania?</h4>
                  <p className="text-sm text-muted-foreground">
                    Czas czytania jest obliczany na podstawie średniej prędkości czytania, 
                    która wynosi około 200 słów na minutę. Czas mówienia bazuje na prędkości 
                    150 słów na minutę.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz licznik znaków działa całkowicie w przeglądarce. Twój tekst nie jest 
                wysyłany na żaden serwer - wszystkie obliczenia wykonywane są lokalnie.
              </p>
            </div>
          </section>
        );
      case "word-counter":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Licznik Słów Online - Policz Słowa w Tekście
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy licznik słów to profesjonalne narzędzie do analizy tekstu. 
                  Szybko policz słowa, zdania, akapity i uzyskaj szczegółowe statystyki 
                  swojego tekstu. Idealne dla pisarzy, studentów, blogerów i copywriterów.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Dla kogo jest licznik słów?</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Studenci</strong> - Sprawdź, czy praca spełnia wymogi dotyczące liczby słów</li>
                <li><strong>Pisarze</strong> - Monitoruj długość rozdziałów i całej książki</li>
                <li><strong>Blogerzy</strong> - Optymalizuj długość artykułów pod SEO (1500+ słów)</li>
                <li><strong>Copywriterzy</strong> - Kontroluj długość tekstów reklamowych</li>
                <li><strong>Tłumacze</strong> - Wyceniaj tłumaczenia na podstawie liczby słów</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Co mierzy licznik słów?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Liczba słów</h4>
                  <p className="text-sm text-muted-foreground">
                    Całkowita liczba słów w tekście, oddzielonych spacjami lub znakami nowej linii.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Unikalne słowa</h4>
                  <p className="text-sm text-muted-foreground">
                    Liczba różnych słów - pokazuje bogactwo słownictwa w tekście.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Średnia długość słowa</h4>
                  <p className="text-sm text-muted-foreground">
                    Średnia liczba znaków przypadająca na jedno słowo.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Najczęstsze słowa</h4>
                  <p className="text-sm text-muted-foreground">
                    Lista 10 najczęściej występujących słów z liczbą powtórzeń.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Ile słów powinien mieć artykuł?</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left">Typ treści</th>
                      <th className="border p-3 text-left">Zalecana długość</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border p-3">Post na blog (SEO)</td><td className="border p-3">1500-2500 słów</td></tr>
                    <tr><td className="border p-3">Artykuł ekspercki</td><td className="border p-3">3000-5000 słów</td></tr>
                    <tr><td className="border p-3">Opis produktu</td><td className="border p-3">300-500 słów</td></tr>
                    <tr><td className="border p-3">Post w social media</td><td className="border p-3">40-100 słów</td></tr>
                    <tr><td className="border p-3">Newsletter</td><td className="border p-3">200-500 słów</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz licznik słów działa całkowicie w przeglądarce - Twój tekst nigdy nie 
                opuszcza Twojego urządzenia. Wszystkie obliczenia wykonywane są lokalnie.
              </p>
            </div>
          </section>
        );
      case "dice-roll":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Rzut Kostką Online - Wirtualna Kostka do Gry
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy symulator rzutu kostką to idealne narzędzie do gier planszowych, 
                  RPG, losowań i zabaw. Wybierz liczbę kostek i ich typ (D4, D6, D8, D10, D12, D20, D100) 
                  i rzucaj bez ograniczeń. Wyniki są w pełni losowe i uczciwe.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Dostępne typy kostek</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">D4</div>
                  <div className="text-sm text-muted-foreground">Czworościan</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">D6</div>
                  <div className="text-sm text-muted-foreground">Klasyczna kostka</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">D8</div>
                  <div className="text-sm text-muted-foreground">Ośmiościan</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">D10</div>
                  <div className="text-sm text-muted-foreground">Dziesięciościan</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">D12</div>
                  <div className="text-sm text-muted-foreground">Dwunastościan</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary mb-1">D20</div>
                  <div className="text-sm text-muted-foreground">Dwudziestościan</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center col-span-2">
                  <div className="text-2xl font-bold text-primary mb-1">D100</div>
                  <div className="text-sm text-muted-foreground">Procentówka (1-100)</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Do czego służy wirtualna kostka?</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Gry planszowe</strong> - Nie masz przy sobie prawdziwej kostki? Użyj naszej!</li>
                <li><strong>Gry RPG</strong> - D&D, Warhammer i inne systemy wymagające różnych kostek</li>
                <li><strong>Losowania</strong> - Uczciwe losowanie kolejności, nagród, zadań</li>
                <li><strong>Edukacja</strong> - Nauka prawdopodobieństwa i statystyki</li>
                <li><strong>Podejmowanie decyzji</strong> - Niech kostka zdecyduje!</li>
                <li><strong>Zabawy i gry online</strong> - Grasz zdalnie z przyjaciółmi</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Funkcje naszego generatora</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Wiele kostek naraz</h4>
                  <p className="text-sm text-muted-foreground">
                    Rzucaj od 1 do 10 kostek jednocześnie i zobacz sumę wszystkich wyników.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Historia rzutów</h4>
                  <p className="text-sm text-muted-foreground">
                    Przeglądaj historię poprzednich rzutów wraz ze statystykami.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Animacja rzutu</h4>
                  <p className="text-sm text-muted-foreground">
                    Realistyczna animacja zwiększa napięcie przed zobaczeniem wyniku.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Statystyki</h4>
                  <p className="text-sm text-muted-foreground">
                    Zobacz średnią, minimum i maksimum z wszystkich rzutów.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Czy wyniki są naprawdę losowe?</h3>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Tak! Nasz generator wykorzystuje JavaScript Math.random(), który zapewnia 
                  pseudolosowe wyniki o wysokiej jakości. Każda ścianka kostki ma identyczne 
                  prawdopodobieństwo wylosowania, więc wyniki są tak samo uczciwe jak rzut 
                  prawdziwą kostką.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Często zadawane pytania</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Co oznacza D6, D20 itp.?</h4>
                  <p className="text-sm text-muted-foreground">
                    Litera &quot;D&quot; pochodzi od angielskiego &quot;dice&quot; (kostka), a liczba oznacza 
                    ilość ścianek. D6 to klasyczna sześcienna kostka (1-6), D20 to 
                    dwudziestościan (1-20) popularny w grach RPG.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jak rzucić wieloma kostkami?</h4>
                  <p className="text-sm text-muted-foreground">
                    Użyj suwaka &quot;Liczba kostek&quot; aby wybrać od 1 do 10 kostek. 
                    Wszystkie kostki będą tego samego typu i zostaną rzucone jednocześnie.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy mogę używać tej kostki do gier na pieniądze?</h4>
                  <p className="text-sm text-muted-foreground">
                    Ten generator jest przeznaczony wyłącznie do celów rozrywkowych i edukacyjnych. 
                    Nie zalecamy używania go do gier hazardowych.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz symulator kostki działa całkowicie w przeglądarce. Nie wymaga instalacji, 
                rejestracji ani połączenia z internetem po załadowaniu strony.
              </p>
            </div>
          </section>
        );
      case "font-generator":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Generator Stylowych Czcionek Online - Kopiuj i Wklej
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy generator czcionek zamienia zwykły tekst na stylowe fonty Unicode, 
                  które możesz skopiować i wkleić wszędzie - na Instagram, Facebook, Twitter, 
                  TikTok, Discord i w innych miejscach. Ponad 25 unikalnych stylów do wyboru!
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Dostępne style czcionek</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Podstawowe</h4>
                  <p className="text-sm text-muted-foreground">
                    𝗣𝗼𝗴𝗿𝘂𝗯𝗶𝗼𝗻𝘆, 𝘒𝘶𝘳𝘴𝘺𝘸𝘢, 𝙋𝙤𝙜𝙧𝙪𝙗𝙞𝙤𝙣𝙖 𝙠𝙪𝙧𝙨𝙮𝙬𝙖, 𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Dekoracyjne</h4>
                  <p className="text-sm text-muted-foreground">
                    𝒮𝓀𝓇𝓎𝓅𝓉, 𝔉𝔯𝔞𝔨𝔱𝔲𝔯𝔞, 𝔾𝕠𝕥𝕙𝕚𝕔, 𝕯𝖔𝖚𝖇𝖑𝖊
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Symbole</h4>
                  <p className="text-sm text-muted-foreground">
                    Ⓦ ⓚⓞⓛⓚⓤ, 🅦 🅝🅔🅖🅐🅣🅨🅦, 🄺🅆🄰🄳🅁🄰🅃
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Stylizowane</h4>
                  <p className="text-sm text-muted-foreground">
                    卂乙ﾌ卂ㄒㄚ匚Ҝ丨, ቿፕጎዐየነክል, ค๒г๏๔ภץ
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Efekty</h4>
                  <p className="text-sm text-muted-foreground">
                    P̲o̲d̲k̲r̲e̲ś̲l̲o̲n̲y̲, P̶r̶z̶e̶k̶r̶e̶ś̶l̶o̶n̶y̶, ᵍᵒʳⁿʸ ⁱⁿᵈᵉᵏˢ
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Dekoracje</h4>
                  <p className="text-sm text-muted-foreground">
                    ✨ Gwiazdki ✨, ♥ Serduszka ♥, 【Nawiasy】
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Jak używać generatora?</h3>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li><strong>Wpisz tekst</strong> - wprowadź tekst, który chcesz przekształcić</li>
                <li><strong>Wybierz styl</strong> - przeglądaj dostępne style czcionek</li>
                <li><strong>Kopiuj</strong> - kliknij przycisk &quot;Kopiuj&quot; przy wybranym stylu</li>
                <li><strong>Wklej</strong> - wklej tekst w dowolnym miejscu (Ctrl+V / Cmd+V)</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Gdzie możesz użyć stylowych czcionek?</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Instagram</strong> - bio, posty, stories, komentarze</li>
                <li><strong>Facebook</strong> - posty, komentarze, nazwa profilu</li>
                <li><strong>Twitter/X</strong> - tweety, bio, nazwa użytkownika</li>
                <li><strong>TikTok</strong> - bio, komentarze</li>
                <li><strong>Discord</strong> - wiadomości, nazwa serwera</li>
                <li><strong>WhatsApp</strong> - wiadomości, status</li>
                <li><strong>YouTube</strong> - komentarze, opisy</li>
                <li><strong>Messenger</strong> - wiadomości</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Często zadawane pytania</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jak to działa?</h4>
                  <p className="text-sm text-muted-foreground">
                    Generator używa specjalnych znaków Unicode, które wyglądają jak stylowe czcionki. 
                    To nie są prawdziwe fonty, ale znaki z różnych alfabetów i symboli matematycznych, 
                    które można kopiować i wklejać jako zwykły tekst.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy to działa wszędzie?</h4>
                  <p className="text-sm text-muted-foreground">
                    Większość platform i aplikacji obsługuje znaki Unicode. Jednak niektóre 
                    mogą nie wyświetlać wszystkich stylów poprawnie. Najlepiej przetestować 
                    przed użyciem.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy stylowe czcionki wpływają na SEO?</h4>
                  <p className="text-sm text-muted-foreground">
                    Tak, wyszukiwarki mogą mieć problem z indeksowaniem tekstu Unicode. 
                    Używaj stylowych czcionek do dekoracji, nie do głównej treści strony.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy polskie znaki są obsługiwane?</h4>
                  <p className="text-sm text-muted-foreground">
                    Niektóre style mogą nie obsługiwać polskich znaków diakrytycznych (ą, ę, ó, itd.). 
                    W takim przypadku polskie litery pozostaną w oryginalnej formie.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz generator czcionek działa całkowicie w przeglądarce. Twój tekst nie jest 
                wysyłany na żaden serwer - wszystkie przekształcenia wykonywane są lokalnie.
              </p>
            </div>
          </section>
        );
      case "countdown-vacation":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Odliczanie do Wakacji 2026 - Ile Dni Zostało?
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz licznik odlicza czas do wakacji letnich w Polsce. Sprawdź ile dni, 
                  godzin, minut i sekund zostało do końca roku szkolnego i początku 
                  upragnionego wypoczynku!
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Kiedy zaczynają się wakacje 2026?</h3>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-muted-foreground">
                  Wakacje letnie w Polsce rozpoczynają się tradycyjnie w ostatni piątek 
                  czerwca i trwają do 31 sierpnia. W 2026 roku wakacje zaczną się 
                  około <strong>26-28 czerwca</strong>.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Dla kogo jest ten licznik?</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Uczniowie</strong> - odliczaj dni do końca szkoły</li>
                <li><strong>Nauczyciele</strong> - sprawdź ile zostało do przerwy</li>
                <li><strong>Rodzice</strong> - planuj wakacyjne wyjazdy z dziećmi</li>
                <li><strong>Studenci</strong> - czekaj na sesję i wolne</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Ciekawostki o wakacjach w Polsce</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Najdłuższe wakacje w Europie</h4>
                  <p className="text-sm text-muted-foreground">
                    Polskie wakacje letnie (około 9 tygodni) są jednymi z najdłuższych w Europie.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Historia wakacji</h4>
                  <p className="text-sm text-muted-foreground">
                    Tradycja letnich wakacji szkolnych sięga XIX wieku i związana jest z pracami polowymi.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Licznik aktualizuje się automatycznie co sekundę. Wszystkie obliczenia 
                wykonywane są w Twojej przeglądarce.
              </p>
            </div>
          </section>
        );
      case "countdown-christmas":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Odliczanie do Świąt Bożego Narodzenia 2026
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Ile dni zostało do Gwiazdki? Nasz świąteczny licznik odlicza czas do 
                  Wigilii Bożego Narodzenia. Sprawdź ile dni, godzin i minut dzieli Cię 
                  od magicznego świątecznego czasu!
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Kiedy są Święta Bożego Narodzenia?</h3>
              <div className="p-4 bg-gradient-to-r from-red-50 to-green-50 dark:from-red-950/20 dark:to-green-950/20 rounded-lg">
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>24 grudnia</strong> - Wigilia Bożego Narodzenia</li>
                  <li><strong>25 grudnia</strong> - Pierwszy dzień świąt (dzień wolny)</li>
                  <li><strong>26 grudnia</strong> - Drugi dzień świąt (dzień wolny)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Polskie tradycje wigilijne</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">🌟 Pierwsza gwiazdka</h4>
                  <p className="text-sm text-muted-foreground">
                    Tradycyjnie wieczerza wigilijna zaczyna się po pojawieniu się pierwszej gwiazdki na niebie.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">🍽️ 12 potraw</h4>
                  <p className="text-sm text-muted-foreground">
                    Na stole wigilijnym powinno być 12 tradycyjnych potraw, symbolizujących 12 apostołów.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">🎄 Choinka</h4>
                  <p className="text-sm text-muted-foreground">
                    Tradycja ubierania choinki przyszła do Polski z Niemiec w XIX wieku.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">📖 Opłatek</h4>
                  <p className="text-sm text-muted-foreground">
                    Dzielenie się opłatkiem i składanie życzeń to jedna z najważniejszych tradycji.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Świąteczny licznik aktualizuje się co sekundę. Wesołych Świąt! 🎄
              </p>
            </div>
          </section>
        );
      case "countdown-date":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Odliczanie do Dowolnej Daty Online
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Ustaw własną datę i odliczaj czas do ważnego wydarzenia! Nasz licznik 
                  pokaże Ci ile dni, godzin, minut i sekund zostało do urodzin, ślubu, 
                  egzaminu, wyjazdu lub innego ważnego dla Ciebie momentu.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Do czego możesz odliczać?</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Urodziny</strong> - swoje lub bliskiej osoby</li>
                <li><strong>Ślub</strong> - wielki dzień wymaga przygotowań</li>
                <li><strong>Egzamin</strong> - matura, sesja, prawo jazdy</li>
                <li><strong>Wyjazd</strong> - wakacje, podróż, lot</li>
                <li><strong>Koncert</strong> - czekasz na występ ulubionego artysty</li>
                <li><strong>Premiera</strong> - gra, film, serial</li>
                <li><strong>Spotkanie</strong> - randka, reunion, konferencja</li>
                <li><strong>Dowolne wydarzenie</strong> - wszystko co jest dla Ciebie ważne!</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Jak używać licznika?</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Wybierz datę wydarzenia z kalendarza</li>
                <li>Opcjonalnie dodaj nazwę wydarzenia</li>
                <li>Obserwuj odliczanie w czasie rzeczywistym</li>
                <li>Licznik działa nawet po odświeżeniu strony (data zapisana w URL)</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Często zadawane pytania</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy mogę odliczać do daty w przeszłości?</h4>
                  <p className="text-sm text-muted-foreground">
                    Tak! Jeśli wybierzesz datę z przeszłości, licznik pokaże ile czasu 
                    minęło od tego wydarzenia.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy mogę udostępnić link do mojego odliczania?</h4>
                  <p className="text-sm text-muted-foreground">
                    Aktualnie data jest przechowywana lokalnie. Możesz po prostu skopiować 
                    adres strony i ustawić datę ponownie.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Licznik aktualizuje się automatycznie co sekundę. Wszystkie dane 
                przechowywane są lokalnie w Twojej przeglądarce.
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
