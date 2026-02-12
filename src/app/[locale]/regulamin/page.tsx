import { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckCircle, AlertTriangle, Scale, Gavel, RefreshCw, Mail } from "lucide-react";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

const BASE_URL = "https://utllo.com";

const LAST_UPDATED: Record<string, string> = {
  pl: "6 lutego 2026",
  en: "February 6, 2026",
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn ? "Terms of Service | utllo" : "Regulamin | utllo",
    description: isEn
      ? "Terms of service for utllo.com. Rules for using free online tools, user rights and obligations."
      : "Regulamin korzystania z serwisu utllo.pl. Zasady użytkowania darmowych narzędzi online, prawa i obowiązki użytkowników.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/regulamin`,
    },
    openGraph: {
      title: isEn ? "Terms of Service | utllo" : "Regulamin | utllo",
      description: isEn
        ? "Terms of service for utllo.com. Rules for using free online tools."
        : "Regulamin korzystania z serwisu utllo.pl. Zasady użytkowania darmowych narzędzi online.",
      url: `${BASE_URL}/${locale}/regulamin`,
      type: "website",
      locale: isEn ? "en_US" : "pl_PL",
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: dictionary.nav.home, url: `/${locale}` },
    { name: isEn ? "Terms of Service" : "Regulamin", url: `/${locale}/regulamin` },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={breadcrumbItems} className="mb-8" />

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600">
            <FileText className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {isEn ? "Terms of Service" : "Regulamin"}
        </h1>
        <p className="text-muted-foreground">
          {isEn ? "Last updated" : "Ostatnia aktualizacja"}: {LAST_UPDATED[locale] || LAST_UPDATED.en}
        </p>
      </section>

      <div className="max-w-3xl mx-auto">
        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground m-0">
              {isEn ? (
                <>
                  These Terms of Service govern the use of <strong>utllo.com</strong>. By using our services, you agree to the following terms. Please read them carefully before using the site.
                </>
              ) : (
                <>
                  Niniejszy Regulamin określa zasady korzystania z serwisu <strong>utllo.pl</strong>. Korzystając z naszych usług, akceptujesz poniższe warunki. Prosimy o uważne zapoznanie się z nimi przed rozpoczęciem korzystania z serwisu.
                </>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Section 1: Definitions */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">
              {isEn ? "1. Definitions" : "1. Definicje"}
            </h2>
          </div>
          <ul className="space-y-3 text-muted-foreground">
            {isEn ? (
              <>
                <li>
                  <strong>Service</strong> — the website available at utllo.com, including all subpages and tools.
                </li>
                <li>
                  <strong>User</strong> — any person using the Service.
                </li>
                <li>
                  <strong>Tools</strong> — functionalities available on the Service, such as generators, converters, calculators, and others.
                </li>
                <li>
                  <strong>Provider</strong> — the owner and administrator of utllo.com.
                </li>
              </>
            ) : (
              <>
                <li>
                  <strong>Serwis</strong> - strona internetowa dostępna pod adresem utllo.pl wraz ze wszystkimi podstronami i narzędziami.
                </li>
                <li>
                  <strong>Użytkownik</strong> - każda osoba korzystająca z Serwisu.
                </li>
                <li>
                  <strong>Narzędzia</strong> - funkcjonalności dostępne w Serwisie, takie jak generatory, konwertery, kalkulatory i inne.
                </li>
                <li>
                  <strong>Usługodawca</strong> - właściciel i administrator Serwisu utllo.pl.
                </li>
              </>
            )}
          </ul>
        </section>

        {/* Section 2: Service Description */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">
              {isEn ? "2. Service description" : "2. Opis usług"}
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {isEn
              ? "utllo.com offers free online tools, including:"
              : "Serwis utllo.pl oferuje darmowe narzędzia online, w tym:"}
          </p>
          <ul className="space-y-2 text-muted-foreground">
            {isEn ? (
              <>
                <li>Generators (passwords, Lorem Ipsum, UUID, QR codes, and more)</li>
                <li>File converters (PDF, images, documents)</li>
                <li>Calculators (BMI, proportions, weighted average)</li>
                <li>Randomizers (numbers, quotes, decisions)</li>
                <li>Counters and countdowns (vacation, holidays, custom dates)</li>
              </>
            ) : (
              <>
                <li>Generatory (haseł, Lorem Ipsum, UUID, kodów QR i inne)</li>
                <li>Konwertery plików (PDF, obrazy, dokumenty)</li>
                <li>Kalkulatory (BMI, proporcji, średniej ważonej)</li>
                <li>Narzędzia losujące (liczby, cytaty, decyzje)</li>
                <li>Liczniki i odliczania (do wakacji, świąt, własnej daty)</li>
              </>
            )}
          </ul>
          <p className="text-muted-foreground mt-4">
            {isEn
              ? "Most tools run locally in the user's browser, without sending data to the Provider's servers."
              : "Większość narzędzi działa lokalnie w przeglądarce użytkownika, bez przesyłania danych na serwery Usługodawcy."}
          </p>
        </section>

        {/* Section 3: User Responsibilities */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">
              {isEn ? "3. User responsibilities" : "3. Obowiązki użytkownika"}
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {isEn ? "The User agrees to:" : "Użytkownik zobowiązuje się do:"}
          </p>
          <ul className="space-y-2 text-muted-foreground">
            {isEn ? (
              <>
                <li>Use the Service in compliance with applicable law</li>
                <li>Not use the tools for unlawful purposes</li>
                <li>Not take actions that could disrupt the operation of the Service</li>
                <li>Not use automated systems to scrape content from the Service</li>
                <li>Not attempt unauthorized access to the Service&apos;s systems</li>
              </>
            ) : (
              <>
                <li>Korzystania z Serwisu zgodnie z obowiązującym prawem</li>
                <li>Nieużywania narzędzi do celów niezgodnych z prawem</li>
                <li>Niepodejmowania działań mogących zakłócić działanie Serwisu</li>
                <li>Niekorzystania z automatycznych systemów pobierających treści z Serwisu</li>
                <li>Niepodejmowania prób nieautoryzowanego dostępu do systemów Serwisu</li>
              </>
            )}
          </ul>
        </section>

        {/* Section 4: Intellectual Property */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
              <Scale className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">
              {isEn ? "4. Intellectual property" : "4. Własność intelektualna"}
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {isEn
              ? "All elements of the Service, including:"
              : "Wszystkie elementy Serwisu, w tym:"}
          </p>
          <ul className="space-y-2 text-muted-foreground mb-4">
            {isEn ? (
              <>
                <li>Source code and software</li>
                <li>Graphic design and page layout</li>
                <li>Logos and trademarks</li>
                <li>Text and multimedia content</li>
              </>
            ) : (
              <>
                <li>Kod źródłowy i oprogramowanie</li>
                <li>Projekt graficzny i układ strony</li>
                <li>Logo i znaki towarowe</li>
                <li>Treści tekstowe i multimedialne</li>
              </>
            )}
          </ul>
          <p className="text-muted-foreground">
            {isEn
              ? "are the property of the Provider or are used under appropriate licenses. Copying, modifying, or distributing elements of the Service without permission is prohibited."
              : "stanowią własność Usługodawcy lub są wykorzystywane na podstawie odpowiednich licencji. Kopiowanie, modyfikowanie lub rozpowszechnianie elementów Serwisu bez zgody jest zabronione."}
          </p>
        </section>

        {/* Section 5: Disclaimers */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">
              {isEn ? "5. Disclaimer" : "5. Wyłączenie odpowiedzialności"}
            </h2>
          </div>
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-muted-foreground mb-4">
                <strong>{isEn ? "Tools are provided \"as is\"." : "Narzędzia są udostępniane \"tak jak są\" (as is)."}</strong>
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {isEn ? (
                  <>
                    <li>The Provider does not guarantee uninterrupted and error-free operation of the Service.</li>
                    <li>The Provider is not responsible for results generated by the tools.</li>
                    <li>The User uses the tools at their own risk and responsibility.</li>
                    <li>The Provider is not liable for damages resulting from use or inability to use the Service.</li>
                  </>
                ) : (
                  <>
                    <li>Usługodawca nie gwarantuje nieprzerwanego i bezbłędnego działania Serwisu.</li>
                    <li>Usługodawca nie ponosi odpowiedzialności za wyniki generowane przez narzędzia.</li>
                    <li>Użytkownik korzysta z narzędzi na własne ryzyko i odpowiedzialność.</li>
                    <li>Usługodawca nie odpowiada za szkody wynikłe z korzystania lub niemożności korzystania z Serwisu.</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Section 6: Liability */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <Gavel className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">
              {isEn ? "6. Limitation of liability" : "6. Ograniczenie odpowiedzialności"}
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {isEn
              ? "To the maximum extent permitted by law:"
              : "W maksymalnym zakresie dozwolonym przez prawo:"}
          </p>
          <ul className="space-y-2 text-muted-foreground">
            {isEn ? (
              <>
                <li>The Provider shall not be liable for any indirect, incidental, special, or consequential damages.</li>
                <li>The Provider&apos;s total liability is limited to the value of any fees paid by the User (in the case of a free Service — zero).</li>
              </>
            ) : (
              <>
                <li>Usługodawca nie ponosi odpowiedzialności za jakiekolwiek szkody pośrednie, przypadkowe, szczególne lub wynikowe.</li>
                <li>Całkowita odpowiedzialność Usługodawcy jest ograniczona do wartości ewentualnych opłat poniesionych przez Użytkownika (w przypadku Serwisu bezpłatnego - do zera).</li>
              </>
            )}
          </ul>
        </section>

        {/* Section 7: Governing Law */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
              <Scale className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">
              {isEn ? "7. Governing law" : "7. Prawo właściwe"}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {isEn
              ? "These Terms are governed by Polish law. Any disputes arising from the use of the Service shall be resolved by courts competent for the Provider's registered office, unless the law provides otherwise."
              : "Niniejszy Regulamin podlega prawu polskiemu. Wszelkie spory wynikające z korzystania z Serwisu będą rozstrzygane przez sądy właściwe dla siedziby Usługodawcy, chyba że przepisy prawa stanowią inaczej."}
          </p>
        </section>

        {/* Section 8: Changes */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
              <RefreshCw className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">
              {isEn ? "8. Changes to Terms" : "8. Zmiany Regulaminu"}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {isEn
              ? "The Provider reserves the right to change these Terms at any time. Changes take effect upon publication of the updated version on the Service. Continued use of the Service after changes constitutes acceptance of the new Terms."
              : "Usługodawca zastrzega sobie prawo do zmiany niniejszego Regulaminu w dowolnym czasie. Zmiany wchodzą w życie z chwilą opublikowania zaktualizowanej wersji w Serwisie. Dalsze korzystanie z Serwisu po wprowadzeniu zmian oznacza akceptację nowego Regulaminu."}
          </p>
        </section>

        {/* Section 9: Contact */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">
              {isEn ? "9. Contact" : "9. Kontakt"}
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {isEn
              ? "If you have questions about these Terms, please contact us:"
              : "W przypadku pytań dotyczących Regulaminu, prosimy o kontakt:"}
          </p>
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground m-0">
                <strong>Email:</strong>{" "}
                <a href="mailto:kontakt@utllo.com" className="text-primary hover:underline">
                  kontakt@utllo.com
                </a>
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Final Note */}
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground m-0">
              {isEn ? (
                <>
                  By using utllo.com, you confirm that you have read these Terms of Service and accept their provisions. We also encourage you to read our{" "}
                  <Link href={`/${locale}/polityka-prywatnosci`} className="text-primary hover:underline">
                    Privacy Policy
                  </Link>.
                </>
              ) : (
                <>
                  Korzystając z serwisu utllo.pl, potwierdzasz, że zapoznałeś się z niniejszym Regulaminem i akceptujesz jego postanowienia. Zachęcamy również do zapoznania się z naszą{" "}
                  <Link href={`/${locale}/polityka-prywatnosci`} className="text-primary hover:underline">
                    Polityką Prywatności
                  </Link>.
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
