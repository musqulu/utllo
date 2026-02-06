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

const BASE_URL = "https://uttlo.com";
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
