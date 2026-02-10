import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getToolsByCategory, getToolByCategoryAndSlug, categoryMeta, getToolUrl, getRelatedTools } from "@/lib/tools";
import { JsonLd, generateWebApplicationSchema, generateBreadcrumbSchema } from "@/components/seo/json-ld";
import { ToolPlaceholder } from "@/components/layout/tool-placeholder";

// Tool Components
import { CharacterCounter } from "@/components/text-counter/character-counter";
import { WordCounter } from "@/components/text-counter/word-counter";
import { CountdownVacation } from "@/components/countdown/countdown-vacation";
import { CountdownChristmas } from "@/components/countdown/countdown-christmas";
import { CountdownDate } from "@/components/countdown/countdown-date";
import { WhiteScreenTool } from "@/components/white-screen/white-screen-tool";
import { AmountInWords } from "@/components/amount-in-words/amount-in-words";
import { CaesarCipher } from "@/components/caesar-cipher/caesar-cipher";

const BASE_URL = "https://utllo.com";
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
      case "white-screen":
        return (
          <WhiteScreenTool
            dictionary={{
              title: (toolDict as any).title || "Biały Ekran",
              subtitle: (toolDict as any).subtitle || "Pełnoekranowy wyświetlacz koloru",
              fullscreen: (toolDict as any).fullscreen || "Pełny ekran",
              exitFullscreen: (toolDict as any).exitFullscreen || "Wyjdź z pełnego ekranu",
              pixelTest: (toolDict as any).pixelTest || "Test pikseli",
              stopTest: (toolDict as any).stopTest || "Kliknij aby zatrzymać test",
              customColor: (toolDict as any).customColor || "Własny kolor (HEX)",
              clickToExit: (toolDict as any).clickToExit || "Kliknij aby wyjść",
              presets: (toolDict as any).presets || "Gotowe kolory",
              currentColor: (toolDict as any).currentColor || "Aktualny kolor",
            }}
          />
        );
      case "amount-in-words":
        return (
          <AmountInWords
            dictionary={{
              title: (toolDict as any).title || "Kwota Słownie",
              subtitle: (toolDict as any).subtitle || "Zamień dowolną liczbę lub kwotę na zapis słowny po polsku",
              inputLabel: (toolDict as any).inputLabel || "Wpisz liczbę",
              inputPlaceholder: (toolDict as any).inputPlaceholder || "np. 1234.56",
              result: (toolDict as any).result || "Wynik słownie",
              copy: (toolDict as any).copy || "Kopiuj",
              copied: (toolDict as any).copied || "Skopiowano!",
              clear: (toolDict as any).clear || "Wyczyść",
              currency: (toolDict as any).currency || "Tryb walutowy (PLN)",
              numberOnly: (toolDict as any).numberOnly || "Tylko liczba",
            }}
          />
        );
      case "caesar-cipher":
        return (
          <CaesarCipher
            dictionary={{
              title: (toolDict as any).title || "Szyfr Cezara",
              subtitle: (toolDict as any).subtitle || "Szyfruj i deszyfruj tekst przesunięciem liter alfabetu",
              inputLabel: (toolDict as any).inputLabel || "Tekst do zaszyfrowania",
              inputPlaceholder: (toolDict as any).inputPlaceholder || "Wpisz tekst...",
              result: (toolDict as any).result || "Wynik",
              shift: (toolDict as any).shift || "Przesunięcie",
              encrypt: (toolDict as any).encrypt || "Szyfruj",
              decrypt: (toolDict as any).decrypt || "Deszyfruj",
              copy: (toolDict as any).copy || "Kopiuj",
              copied: (toolDict as any).copied || "Skopiowano!",
              clear: (toolDict as any).clear || "Wyczyść",
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
      case "amount-in-words":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Kwota Słownie Online - Zamień Liczbę na Słowa po Polsku
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy konwerter „kwota słownie" zamienia dowolną liczbę lub kwotę 
                  pieniężną na zapis słowny w języku polskim. Narzędzie jest niezbędne przy 
                  wystawianiu faktur, pisaniu umów, wypełnianiu czeków i przelewów bankowych, 
                  gdzie kwota musi być zapisana zarówno cyframi, jak i słownie.
                </p>
                <p>
                  Konwerter obsługuje tryb walutowy (złote i grosze) oraz tryb samej liczby. 
                  Poprawnie odmienia wszystkie formy gramatyczne - od pojedynczych złotych 
                  po miliardy i biliony.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Kiedy potrzebujesz zapisu kwoty słownie?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Faktury VAT</h4>
                  <p className="text-sm text-muted-foreground">
                    Na fakturach kwota do zapłaty powinna być zapisana słownie, 
                    aby uniknąć pomyłek i fałszerstw.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Umowy i kontrakty</h4>
                  <p className="text-sm text-muted-foreground">
                    W dokumentach prawnych kwoty zapisuje się słownie dla jednoznaczności 
                    i ochrony przed nieautoryzowanymi zmianami.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czeki i przelewy</h4>
                  <p className="text-sm text-muted-foreground">
                    Banki wymagają zapisu kwoty słownie na czekach. 
                    Przy przelewach słowny zapis pomaga uniknąć błędów.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Akty notarialne</h4>
                  <p className="text-sm text-muted-foreground">
                    Notariusze wymagają zapisu kwot słownie w aktach sprzedaży 
                    nieruchomości, darowiznach i innych czynnościach prawnych.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Przykłady zapisu kwot słownie</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left">Liczba</th>
                      <th className="border p-3 text-left">Zapis słownie (PLN)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border p-3 font-medium">1,00 zł</td>
                      <td className="border p-3">jeden złoty zero groszy</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">5,50 zł</td>
                      <td className="border p-3">pięć złotych pięćdziesiąt groszy</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">23,00 zł</td>
                      <td className="border p-3">dwadzieścia trzy złote zero groszy</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">100,00 zł</td>
                      <td className="border p-3">sto złotych zero groszy</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">1 234,56 zł</td>
                      <td className="border p-3">tysiąc dwieście trzydzieści cztery złote pięćdziesiąt sześć groszy</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">1 000 000,00 zł</td>
                      <td className="border p-3">milion złotych zero groszy</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Odmiana polskich liczebników</h3>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Język polski ma skomplikowaną odmianę liczebników. Nasz konwerter 
                  poprawnie obsługuje wszystkie formy gramatyczne:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-3 text-left">Forma</th>
                        <th className="border p-3 text-left">Złote</th>
                        <th className="border p-3 text-left">Grosze</th>
                        <th className="border p-3 text-left">Tysiące</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr>
                        <td className="border p-3">1</td>
                        <td className="border p-3">złoty</td>
                        <td className="border p-3">grosz</td>
                        <td className="border p-3">tysiąc</td>
                      </tr>
                      <tr>
                        <td className="border p-3">2, 3, 4</td>
                        <td className="border p-3">złote</td>
                        <td className="border p-3">grosze</td>
                        <td className="border p-3">tysiące</td>
                      </tr>
                      <tr>
                        <td className="border p-3">5-21</td>
                        <td className="border p-3">złotych</td>
                        <td className="border p-3">groszy</td>
                        <td className="border p-3">tysięcy</td>
                      </tr>
                      <tr>
                        <td className="border p-3">22, 23, 24</td>
                        <td className="border p-3">złote</td>
                        <td className="border p-3">grosze</td>
                        <td className="border p-3">tysiące</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Często zadawane pytania</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jaka jest maksymalna obsługiwana liczba?</h4>
                  <p className="text-sm text-muted-foreground">
                    Nasz konwerter obsługuje liczby do 999 bilionów (999 999 999 999 999). 
                    To więcej niż wystarczające dla wszelkich zastosowań biznesowych i prawnych.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy mogę wpisać grosze?</h4>
                  <p className="text-sm text-muted-foreground">
                    Tak! W trybie walutowym wpisz kwotę z kropką lub przecinkiem jako 
                    separatorem dziesiętnym, np. 1234.56 lub 1234,56. Część dziesiętna 
                    zostanie automatycznie zaokrąglona do dwóch miejsc (groszy).
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy narzędzie obsługuje liczby ujemne?</h4>
                  <p className="text-sm text-muted-foreground">
                    Tak, zarówno w trybie walutowym, jak i liczbowym. Liczba ujemna 
                    zostanie poprzedzona słowem „minus".
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy zapis jest poprawny gramatycznie?</h4>
                  <p className="text-sm text-muted-foreground">
                    Tak, nasz konwerter uwzględnia pełną odmianę polskich liczebników, 
                    w tym formy: tysiąc/tysiące/tysięcy, milion/miliony/milionów, 
                    złoty/złote/złotych, grosz/grosze/groszy.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz konwerter „kwota słownie" działa całkowicie w przeglądarce. 
                Twoje dane nie są wysyłane na żaden serwer - wszystkie obliczenia 
                wykonywane są lokalnie na Twoim urządzeniu.
              </p>
            </div>
          </section>
        );
      case "caesar-cipher":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Szyfr Cezara Online - Szyfrowanie i Deszyfrowanie Tekstu
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Szyfr Cezara to jeden z najstarszych i najprostszych sposobów szyfrowania 
                  tekstu. Nazwa pochodzi od Juliusza Cezara, który używał tego szyfru do 
                  ochrony tajnych wiadomości wojskowych. Polega on na przesunięciu każdej 
                  litery w tekście o ustaloną liczbę pozycji w alfabecie.
                </p>
                <p>
                  Nasze darmowe narzędzie pozwala szyfrować i deszyfrować tekst za pomocą 
                  szyfru Cezara z dowolnym przesunięciem od 1 do 25. Wystarczy wpisać tekst, 
                  wybrać przesunięcie i natychmiast zobaczyć wynik.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Jak działa szyfr Cezara?</h3>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Każda litera w tekście jest zastępowana literą znajdującą się o określoną 
                  liczbę pozycji dalej w alfabecie. Na przykład przy przesunięciu o 3:
                </p>
                <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                  <div>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</div>
                  <div>↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓</div>
                  <div>D E F G H I J K L M N O P Q R S T U V W X Y Z A B C</div>
                </div>
                <p>
                  Tak więc słowo <strong>ATAK</strong> z przesunięciem 3 staje się <strong>DWDN</strong>. 
                  Deszyfrowanie odbywa się przez przesunięcie w odwrotnym kierunku.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Przykłady szyfrowania</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left">Tekst</th>
                      <th className="border p-3 text-left">Przesunięcie</th>
                      <th className="border p-3 text-left">Zaszyfrowany</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border p-3">HELLO</td>
                      <td className="border p-3">3</td>
                      <td className="border p-3">KHOOR</td>
                    </tr>
                    <tr>
                      <td className="border p-3">POLSKA</td>
                      <td className="border p-3">5</td>
                      <td className="border p-3">UTRXPF</td>
                    </tr>
                    <tr>
                      <td className="border p-3">SZYFR</td>
                      <td className="border p-3">13 (ROT13)</td>
                      <td className="border p-3">FMLSE</td>
                    </tr>
                    <tr>
                      <td className="border p-3">TAJNA WIADOMOSC</td>
                      <td className="border p-3">7</td>
                      <td className="border p-3">AHQUH DPHDVTVZJ</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Do czego służy szyfr Cezara?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Nauka kryptografii</h4>
                  <p className="text-sm text-muted-foreground">
                    Szyfr Cezara to doskonały punkt wyjścia do nauki podstaw kryptografii 
                    i szyfrowania. Jest prosty do zrozumienia i idealny na lekcje informatyki.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Zagadki i escape roomy</h4>
                  <p className="text-sm text-muted-foreground">
                    Szyfr Cezara jest popularny w escape roomach, grach logicznych 
                    i zagadkach. Łatwość deszyfrowania sprawia, że jest idealny do zabawy.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Proste ukrywanie tekstu</h4>
                  <p className="text-sm text-muted-foreground">
                    Chociaż nie jest bezpieczny, szyfr Cezara może posłużyć do ukrycia 
                    spoilerów, niespodzianek czy prostych wiadomości przed przypadkowym odczytaniem.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">ROT13 w internecie</h4>
                  <p className="text-sm text-muted-foreground">
                    ROT13 (przesunięcie o 13) jest powszechnie używany w internecie do ukrywania 
                    spoilerów i żartów. Jego zaletą jest to, że szyfrowanie = deszyfrowanie.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Czym jest ROT13?</h3>
              <div className="p-4 bg-muted rounded-lg text-muted-foreground space-y-2">
                <p>
                  ROT13 to specjalny przypadek szyfru Cezara z przesunięciem równym 13. 
                  Ponieważ alfabet łaciński ma 26 liter, zastosowanie ROT13 dwukrotnie 
                  przywraca oryginalny tekst. Oznacza to, że ta sama operacja służy 
                  zarówno do szyfrowania, jak i deszyfrowania.
                </p>
                <p>
                  ROT13 jest popularny na forach internetowych i w grupach dyskusyjnych 
                  do ukrywania spoilerów, odpowiedzi na zagadki i treści, które użytkownik 
                  powinien świadomie zdecydować się odczytać.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Czy szyfr Cezara jest bezpieczny?</h3>
              <div className="text-muted-foreground space-y-4">
                <p>
                  <strong>Nie.</strong> Szyfr Cezara ma zaledwie 25 możliwych kluczy 
                  (przesunięć), co oznacza, że można go złamać metodą brute force w kilka 
                  sekund, sprawdzając wszystkie możliwe przesunięcia. Ponadto analiza 
                  częstotliwości liter w zaszyfrowanym tekście pozwala szybko ustalić klucz.
                </p>
                <p>
                  Do bezpiecznego szyfrowania współcześnie używa się algorytmów takich jak 
                  AES, RSA czy szyfrowanie end-to-end. Szyfr Cezara pozostaje jednak 
                  wartościowym narzędziem edukacyjnym i rozrywkowym.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Często zadawane pytania</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy polskie znaki są szyfrowane?</h4>
                  <p className="text-sm text-muted-foreground">
                    Nasze narzędzie szyfruje litery alfabetu łacińskiego (A-Z). Polskie znaki 
                    diakrytyczne (ą, ć, ę, ł, ń, ó, ś, ź, ż) oraz cyfry, spacje i znaki 
                    interpunkcyjne pozostają bez zmian.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jakie przesunięcie stosował Juliusz Cezar?</h4>
                  <p className="text-sm text-muted-foreground">
                    Według historyka Swetoniusza, Juliusz Cezar używał przesunięcia o 3. 
                    Dlatego przesunięcie o 3 jest domyślne w naszym narzędziu.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jak odszyfrować tekst bez znajomości klucza?</h4>
                  <p className="text-sm text-muted-foreground">
                    Wystarczy wypróbować wszystkie 25 możliwych przesunięć. Przy przesunięciu, 
                    które jest prawidłowym kluczem, tekst stanie się czytelny. Możesz też 
                    użyć analizy częstotliwości liter - w języku polskim najczęściej 
                    występują litery: i, a, o, e, z, n.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz szyfr Cezara online działa całkowicie w przeglądarce. 
                Twój tekst nie jest wysyłany na żaden serwer - szyfrowanie 
                i deszyfrowanie odbywa się lokalnie.
              </p>
            </div>
          </section>
        );
      case "white-screen":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6">
                Biały Ekran Online - Pełnoekranowy Wyświetlacz Koloru
              </h2>
              <div className="text-muted-foreground space-y-4">
                <p>
                  Nasz darmowy biały ekran online to wszechstronne narzędzie, które wyświetla 
                  jednolity kolor na pełnym ekranie. Dzięki niemu możesz sprawdzić monitor pod 
                  kątem martwych pikseli, wyczyścić ekran z kurzu i smug, a nawet użyć go jako 
                  oświetlenia do zdjęć lub wideorozmów. Wybierz spośród 12 gotowych kolorów 
                  lub wpisz dowolny kolor w formacie HEX.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Do czego służy biały ekran?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Test martwych pikseli</h4>
                  <p className="text-sm text-muted-foreground">
                    Martwy piksel to punkt na ekranie, który nie świeci prawidłowo. Na białym tle 
                    widać go jako czarną kropkę, na czarnym - jako jasną. Użyj trybu testu pikseli, 
                    który automatycznie przełącza kolory (biały, czarny, czerwony, zielony, niebieski) 
                    aby wykryć wadliwe piksele na każdym kanale koloru.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czyszczenie ekranu</h4>
                  <p className="text-sm text-muted-foreground">
                    Jasne, jednolite tło sprawia, że kurz, odciski palców i smugi są natychmiast 
                    widoczne. Włącz biały ekran na pełnym ekranie, wyłącz oświetlenie pomieszczenia 
                    i przetrzyj monitor miękką ściereczką z mikrofibry. Dzięki temu nie przegapisz 
                    żadnej plamy.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Oświetlenie do zdjęć</h4>
                  <p className="text-sm text-muted-foreground">
                    Biały lub kolorowy ekran może służyć jako dodatkowe źródło światła podczas 
                    robienia zdjęć produktów, selfie lub wideorozmów. Jasność ekranu na maksimum 
                    daje miękkie, rozproszone światło bez ostrych cieni.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Kalibracja monitora</h4>
                  <p className="text-sm text-muted-foreground">
                    Jednolite kolory pomagają sprawdzić, czy ekran wyświetla je równomiernie. 
                    Szukaj ciemniejszych rogów (backlight bleeding), nierówności jasności 
                    i odchyleń kolorystycznych. Przydatne przy zakupie nowego monitora.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Jak wykryć martwe piksele?</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Krok 1:</strong> Ustaw jasność ekranu na maksimum i przyciemnij pomieszczenie.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Krok 2:</strong> Kliknij &quot;Test pikseli&quot; - ekran zacznie automatycznie 
                    przełączać się między kolorami co 3 sekundy.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Krok 3:</strong> Przyjrzyj się uważnie całej powierzchni ekranu. 
                    Martwy piksel to punkt, który nie zmienia koloru wraz z resztą ekranu.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Krok 4:</strong> Jeśli znajdziesz wadliwy piksel na nowym monitorze, 
                    skontaktuj się z producentem - większość oferuje wymianę w ramach gwarancji.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Rodzaje wadliwych pikseli</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-3 text-left">Typ</th>
                      <th className="border p-3 text-left">Opis</th>
                      <th className="border p-3 text-left">Jak wygląda</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3 font-medium">Martwy piksel</td>
                      <td className="border p-3 text-sm">Piksel nie świeci wcale</td>
                      <td className="border p-3 text-sm">Czarny punkt na jasnym tle</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Zablokowany piksel</td>
                      <td className="border p-3 text-sm">Piksel świeci jednym kolorem</td>
                      <td className="border p-3 text-sm">Kolorowa kropka (czerwona, zielona lub niebieska)</td>
                    </tr>
                    <tr>
                      <td className="border p-3 font-medium">Hot piksel</td>
                      <td className="border p-3 text-sm">Piksel świeci białym na ciemnym tle</td>
                      <td className="border p-3 text-sm">Jasny punkt widoczny tylko na czarnym ekranie</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Jak prawidłowo czyścić ekran?</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Wyłącz urządzenie</strong> - na ciemnym ekranie lepiej widać smugi i kurz</li>
                <li><strong>Użyj mikrofibry</strong> - nigdy nie używaj ręczników papierowych, ścierek kuchennych ani chusteczek</li>
                <li><strong>Brak chemikaliów</strong> - nie spryskuj ekranu zwykłym płynem do szyb (zawiera amoniak)</li>
                <li><strong>Delikatne ruchy</strong> - przecieraj okrężnymi ruchami, bez naciskania</li>
                <li><strong>Specjalne płyny</strong> - użyj dedykowanego płynu do ekranów lub lekko zwilżonej wodą ściereczki</li>
                <li><strong>Suszenie</strong> - poczekaj aż ekran wyschnie przed włączeniem</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Dostępne kolory</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white border rounded-lg text-center text-sm">Biały</div>
                <div className="p-3 bg-black text-white rounded-lg text-center text-sm">Czarny</div>
                <div className="p-3 bg-red-500 text-white rounded-lg text-center text-sm">Czerwony</div>
                <div className="p-3 bg-green-500 text-white rounded-lg text-center text-sm">Zielony</div>
                <div className="p-3 bg-blue-500 text-white rounded-lg text-center text-sm">Niebieski</div>
                <div className="p-3 bg-yellow-400 rounded-lg text-center text-sm">Żółty</div>
                <div className="p-3 bg-cyan-400 rounded-lg text-center text-sm">Cyjan</div>
                <div className="p-3 bg-fuchsia-500 text-white rounded-lg text-center text-sm">Magenta</div>
                <div className="p-3 bg-orange-500 text-white rounded-lg text-center text-sm">Pomarańczowy</div>
                <div className="p-3 bg-violet-600 text-white rounded-lg text-center text-sm">Fioletowy</div>
                <div className="p-3 bg-pink-400 text-white rounded-lg text-center text-sm">Różowy</div>
                <div className="p-3 bg-gray-500 text-white rounded-lg text-center text-sm">Szary</div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Możesz też wpisać dowolny kolor w formacie HEX (np. #FF5733).
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Często zadawane pytania</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy biały ekran działa na telefonie?</h4>
                  <p className="text-sm text-muted-foreground">
                    Tak! Narzędzie działa na każdym urządzeniu z przeglądarką internetową - 
                    smartfonach, tabletach, laptopach i monitorach stacjonarnych. Na telefonie 
                    tryb pełnoekranowy ukryje pasek nawigacji.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy biały ekran jest bezpieczny dla ekranów OLED?</h4>
                  <p className="text-sm text-muted-foreground">
                    Tak, krótkotrwałe wyświetlanie białego ekranu nie uszkodzi panelu OLED. 
                    Unikaj jednak pozostawiania statycznego obrazu przez wiele godzin, co może 
                    prowadzić do wypalenia pikseli (burn-in). Test pikseli trwa tylko kilkanaście sekund.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Jak wyjść z trybu pełnoekranowego?</h4>
                  <p className="text-sm text-muted-foreground">
                    Kliknij gdziekolwiek na ekranie lub naciśnij klawisz Escape. 
                    W trybie testu pikseli najpierw zatrzymaj test przyciskiem X w rogu, 
                    a następnie kliknij ekran.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Ile martwych pikseli to wada?</h4>
                  <p className="text-sm text-muted-foreground">
                    Norma ISO 9241-302 określa dopuszczalną liczbę wadliwych pikseli w zależności 
                    od klasy monitora. Większość producentów wymienia monitor przy 3-5 wadliwych pikselach. 
                    W przypadku nowego monitora reklamuj go nawet przy jednym martwym pikselu.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Czy można naprawić martwy piksel?</h4>
                  <p className="text-sm text-muted-foreground">
                    Zablokowany piksel (świecący jednym kolorem) można czasem &quot;odblokować&quot; 
                    poprzez wyświetlanie szybko zmieniających się kolorów na kilkanaście minut. 
                    Martwy piksel (nieświecący) niestety zazwyczaj wymaga wymiany panelu.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz biały ekran działa całkowicie w przeglądarce. Nie wymaga instalacji, 
                rejestracji ani połączenia z internetem po załadowaniu strony. Działa na 
                wszystkich urządzeniach i systemach operacyjnych.
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
