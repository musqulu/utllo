import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getToolsByCategory, getToolByCategoryAndSlug, categoryMeta, getToolUrl, getRelatedTools } from "@/lib/tools";
import { JsonLd, generateWebApplicationSchema, generateBreadcrumbSchema } from "@/components/seo/json-ld";
import { ToolPlaceholder } from "@/components/layout/tool-placeholder";

// Tool Components
import { PdfConverter } from "@/components/pdf-converter/pdf-converter";
import { PdfToWordConverter } from "@/components/pdf-converter/pdf-to-word-converter";

const BASE_URL = "https://utllo.com";
const CATEGORY = "converters";
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
      case "pdf-to-jpg":
        return (
          <PdfConverter
            format="jpg"
            dictionary={{
              uploadTitle: toolDict.uploadTitle || "Wybierz plik PDF",
              uploadDescription: toolDict.uploadDescription || "Przeciągnij plik lub kliknij aby wybrać",
              dropHere: toolDict.dropHere || "Upuść plik tutaj",
              selectFile: toolDict.selectFile || "Wybierz plik",
              orDragDrop: toolDict.orDragDrop || "lub przeciągnij i upuść",
              maxSize: toolDict.maxSize || "Maksymalny rozmiar: 50MB",
              scale: toolDict.scale || "Skala",
              quality: toolDict.quality || "Jakość",
              processing: toolDict.processing || "Przetwarzam",
              page: toolDict.page || "Strona",
              downloadPage: toolDict.downloadPage || "Pobierz stronę",
              downloadAll: toolDict.downloadAll || "Pobierz wszystkie",
              converting: toolDict.converting || "Konwertuję",
              of: toolDict.of || "z",
              newFile: toolDict.newFile || "Nowy plik",
            }}
          />
        );
      case "pdf-to-png":
        return (
          <PdfConverter
            format="png"
            dictionary={{
              uploadTitle: toolDict.uploadTitle || "Wybierz plik PDF",
              uploadDescription: toolDict.uploadDescription || "Przeciągnij plik lub kliknij aby wybrać",
              dropHere: toolDict.dropHere || "Upuść plik tutaj",
              selectFile: toolDict.selectFile || "Wybierz plik",
              orDragDrop: toolDict.orDragDrop || "lub przeciągnij i upuść",
              maxSize: toolDict.maxSize || "Maksymalny rozmiar: 50MB",
              scale: toolDict.scale || "Skala",
              quality: toolDict.quality || "Jakość",
              processing: toolDict.processing || "Przetwarzam",
              page: toolDict.page || "Strona",
              downloadPage: toolDict.downloadPage || "Pobierz stronę",
              downloadAll: toolDict.downloadAll || "Pobierz wszystkie",
              converting: toolDict.converting || "Konwertuję",
              of: toolDict.of || "z",
              newFile: toolDict.newFile || "Nowy plik",
            }}
          />
        );
      case "pdf-to-word":
        return (
          <PdfToWordConverter
            dictionary={{
              title: toolDict.title || "PDF na Word",
              subtitle: toolDict.subtitle || "Wyodrębnij tekst z PDF i zapisz jako dokument Word",
              selectFile: toolDict.selectFile || "Wybierz plik PDF",
              dragDrop: toolDict.dragDrop || "lub przeciągnij i upuść",
              dropHere: toolDict.dropHere || "Upuść plik tutaj",
              maxSize: toolDict.maxSize || "Maksymalny rozmiar: 50MB",
              convert: toolDict.convert || "Konwertuj na Word",
              download: toolDict.download || "Pobierz DOCX",
              converting: toolDict.converting || "Konwertuję",
              extracting: toolDict.extracting || "Wyodrębniam tekst",
              generating: toolDict.generating || "Generuję dokument Word",
              page: toolDict.page || "Strona",
              of: toolDict.of || "z",
              done: toolDict.done || "Gotowe!",
              error: toolDict.error || "Wystąpił błąd",
              newFile: toolDict.newFile || "Nowy plik",
              textOnly: toolDict.textOnly || "Narzędzie wyodrębnia tylko tekst. Formatowanie, obrazy i tabele nie są przenoszone.",
              noText: toolDict.noText || "Nie znaleziono tekstu w tym pliku PDF.",
              pages: toolDict.pages || "stron",
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
      case "pdf-to-jpg":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Jak konwertować PDF na JPG?</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Wybierz plik PDF z dysku lub przeciągnij go na stronę</li>
                <li>Dostosuj skalę i jakość obrazów wyjściowych</li>
                <li>Kliknij „Konwertuj" i poczekaj na zakończenie</li>
                <li>Pobierz pojedyncze strony lub wszystkie jako ZIP</li>
              </ol>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Dlaczego JPG?</h2>
              <p className="text-muted-foreground">
                Format JPG zapewnia doskonałą kompresję przy zachowaniu dobrej jakości obrazu. 
                Idealny do zdjęć, dokumentów kolorowych i materiałów graficznych. 
                Pliki JPG są szeroko obsługiwane i zajmują mało miejsca.
              </p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz darmowy konwerter PDF na JPG działa całkowicie w przeglądarce. 
                Twoje pliki nie są wysyłane na serwer - pełna prywatność gwarantowana.
              </p>
            </div>
          </section>
        );
      case "pdf-to-png":
        return (
          <section className="max-w-3xl mx-auto mt-16 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Jak konwertować PDF na PNG?</h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Wybierz plik PDF z dysku lub przeciągnij go na stronę</li>
                <li>Dostosuj skalę obrazów wyjściowych</li>
                <li>Kliknij „Konwertuj" i poczekaj na zakończenie</li>
                <li>Pobierz pojedyncze strony lub wszystkie jako ZIP</li>
              </ol>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Dlaczego PNG?</h2>
              <p className="text-muted-foreground">
                Format PNG zapewnia bezstratną kompresję i obsługuje przezroczystość. 
                Idealny do grafik, schematów, dokumentów z tekstem i logo. 
                Pliki PNG zachowują pełną jakość przy każdym zapisie.
              </p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz darmowy konwerter PDF na PNG działa całkowicie w przeglądarce. 
                Twoje pliki nie są wysyłane na serwer - pełna prywatność gwarantowana.
              </p>
            </div>
          </section>
        );
      case "pdf-to-word":
        return (
          <section className="max-w-2xl mx-auto mt-16 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Czym jest konwersja PDF na Word?</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Konwersja PDF na Word to proces przekształcania dokumentów w formacie PDF (Portable Document Format) 
                na edytowalne pliki DOCX, obsługiwane przez programy takie jak Microsoft Word, Google Docs czy LibreOffice. 
                Dzięki temu możesz łatwo edytować, kopiować i modyfikować tekst zawarty w dokumentach PDF.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nasze narzędzie wyodrębnia tekst z każdej strony pliku PDF i tworzy czysty dokument Word 
                z zachowaniem podziału na strony. Cały proces odbywa się w Twojej przeglądarce — 
                pliki nie są wysyłane na żaden serwer.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Jak działa ekstrakcja tekstu z PDF?</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                PDF to format zaprojektowany do prezentacji dokumentów, a nie do ich edycji. Tekst w pliku PDF 
                jest przechowywany jako zestaw pozycjonowanych znaków, bez informacji o akapitach czy strukturze dokumentu. 
                Nasze narzędzie analizuje pozycje tekstu na każdej stronie i rekonstruuje kolejność czytania — 
                od góry do dołu, od lewej do prawej.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Ważne ograniczenia:</strong> Narzędzie wyodrębnia wyłącznie tekst. Formatowanie 
                (pogrubienie, kursywa, kolory, czcionki), obrazy, tabele i inne elementy graficzne nie są przenoszone. 
                Zeskanowane dokumenty PDF (zawierające obrazy zamiast tekstu) nie mogą być konwertowane — 
                wymagają rozpoznawania tekstu (OCR).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Kiedy warto konwertować PDF na Word?</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Edycja dokumentów</strong> — gdy potrzebujesz zmodyfikować tekst z otrzymanego PDF</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Kopiowanie treści</strong> — szybkie przeniesienie tekstu do innego dokumentu lub projektu</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Dostępność</strong> — konwersja na edytowalny format ułatwia czytanie osobom z niepełnosprawnościami</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Archiwizacja</strong> — zapisanie treści PDF w formacie łatwym do przeszukiwania i edycji</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span><strong>Raporty i prezentacje</strong> — wykorzystanie danych tekstowych z PDF w nowych dokumentach</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">PDF vs DOCX — porównanie formatów</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 pr-4 font-semibold">Cecha</th>
                      <th className="text-left py-3 pr-4 font-semibold">PDF</th>
                      <th className="text-left py-3 font-semibold">DOCX (Word)</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b">
                      <td className="py-3 pr-4 font-medium">Edycja</td>
                      <td className="py-3 pr-4">Trudna, wymaga specjalnego oprogramowania</td>
                      <td className="py-3">Łatwa, w każdym edytorze tekstu</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4 font-medium">Wygląd</td>
                      <td className="py-3 pr-4">Zawsze identyczny na każdym urządzeniu</td>
                      <td className="py-3">Może się różnić w zależności od czcionek i programu</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4 font-medium">Rozmiar pliku</td>
                      <td className="py-3 pr-4">Zwykle mniejszy</td>
                      <td className="py-3">Może być większy (szczególnie z obrazami)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 pr-4 font-medium">Drukowanie</td>
                      <td className="py-3 pr-4">Doskonałe, zachowuje układ</td>
                      <td className="py-3">Dobre, ale może wymagać dopasowania</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium">Zastosowanie</td>
                      <td className="py-3 pr-4">Udostępnianie, archiwizacja, druk</td>
                      <td className="py-3">Tworzenie, edycja, współpraca</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Wskazówki — jak uzyskać najlepsze wyniki</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span><strong>Pliki z warstwą tekstową</strong> — najlepiej konwertują się pliki PDF utworzone cyfrowo (np. z Worda, przeglądarki), a nie zeskanowane</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span><strong>Proste dokumenty</strong> — dokumenty z prostym układem tekstu dadzą najlepsze rezultaty</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span><strong>Sprawdź wynik</strong> — zawsze przejrzyj wynikowy dokument Word i popraw ewentualne niedoskonałości</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span><strong>Zeskanowane PDF</strong> — jeśli PDF zawiera tylko obrazy (skan), tekst nie zostanie wyodrębniony. Potrzebujesz narzędzia OCR</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Najczęściej zadawane pytania</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">Czy konwerter jest darmowy?</h3>
                  <p className="text-muted-foreground text-sm">
                    Tak, narzędzie jest całkowicie darmowe i nie wymaga rejestracji. Możesz konwertować dowolną liczbę plików.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Czy moje pliki są bezpieczne?</h3>
                  <p className="text-muted-foreground text-sm">
                    Tak, cała konwersja odbywa się w Twojej przeglądarce. Pliki nie są wysyłane na żaden serwer — 
                    masz pełną kontrolę nad swoimi dokumentami.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Czy formatowanie zostanie zachowane?</h3>
                  <p className="text-muted-foreground text-sm">
                    Narzędzie wyodrębnia wyłącznie tekst. Formatowanie (pogrubienie, kursywa, kolory), 
                    obrazy i tabele nie są przenoszone. Otrzymasz czysty tekst podzielony na akapity.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Co z zeskanowanymi plikami PDF?</h3>
                  <p className="text-muted-foreground text-sm">
                    Zeskanowane dokumenty PDF zawierają obrazy zamiast tekstu i nie mogą być konwertowane tym narzędziem. 
                    Do rozpoznawania tekstu ze skanów potrzebne jest oprogramowanie OCR (Optical Character Recognition).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Jaki jest maksymalny rozmiar pliku?</h3>
                  <p className="text-muted-foreground text-sm">
                    Maksymalny rozmiar pliku to 50 MB. Ponieważ konwersja odbywa się w przeglądarce, 
                    bardzo duże pliki mogą przetwarzać się dłużej.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Nasz darmowy konwerter PDF na Word działa całkowicie w przeglądarce.
                Twoje pliki nie są wysyłane na serwer - pełna prywatność i bezpieczeństwo gwarantowane.
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
