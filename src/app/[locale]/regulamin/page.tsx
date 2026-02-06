import { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckCircle, AlertTriangle, Scale, Gavel, RefreshCw, Mail } from "lucide-react";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

const BASE_URL = "https://uttlo.com";
const LAST_UPDATED = "6 lutego 2026";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Regulamin | uttlo",
    description: "Regulamin korzystania z serwisu uttlo.pl. Zasady użytkowania darmowych narzędzi online, prawa i obowiązki użytkowników.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/regulamin`,
    },
    openGraph: {
      title: "Regulamin | uttlo",
      description: "Regulamin korzystania z serwisu uttlo.pl. Zasady użytkowania darmowych narzędzi online.",
      url: `${BASE_URL}/${locale}/regulamin`,
      type: "website",
      locale: "pl_PL",
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);

  const breadcrumbItems = [
    { name: dictionary.nav.home, url: `/${locale}` },
    { name: "Regulamin", url: `/${locale}/regulamin` },
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
          Regulamin
        </h1>
        <p className="text-muted-foreground">
          Ostatnia aktualizacja: {LAST_UPDATED}
        </p>
      </section>

      <div className="max-w-3xl mx-auto">
        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground m-0">
              Niniejszy Regulamin określa zasady korzystania z serwisu <strong>uttlo.pl</strong>. 
              Korzystając z naszych usług, akceptujesz poniższe warunki. Prosimy o uważne 
              zapoznanie się z nimi przed rozpoczęciem korzystania z serwisu.
            </p>
          </CardContent>
        </Card>

        {/* Section 1: Definitions */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">1. Definicje</h2>
          </div>
          <ul className="space-y-3 text-muted-foreground">
            <li>
              <strong>Serwis</strong> - strona internetowa dostępna pod adresem uttlo.pl 
              wraz ze wszystkimi podstronami i narzędziami.
            </li>
            <li>
              <strong>Użytkownik</strong> - każda osoba korzystająca z Serwisu.
            </li>
            <li>
              <strong>Narzędzia</strong> - funkcjonalności dostępne w Serwisie, takie jak 
              generatory, konwertery, kalkulatory i inne.
            </li>
            <li>
              <strong>Usługodawca</strong> - właściciel i administrator Serwisu uttlo.pl.
            </li>
          </ul>
        </section>

        {/* Section 2: Service Description */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">2. Opis usług</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Serwis uttlo.pl oferuje darmowe narzędzia online, w tym:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>Generatory (haseł, Lorem Ipsum, UUID, kodów QR i inne)</li>
            <li>Konwertery plików (PDF, obrazy, dokumenty)</li>
            <li>Kalkulatory (BMI, proporcji, średniej ważonej)</li>
            <li>Narzędzia losujące (liczby, cytaty, decyzje)</li>
            <li>Liczniki i odliczania (do wakacji, świąt, własnej daty)</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            Większość narzędzi działa lokalnie w przeglądarce użytkownika, bez przesyłania 
            danych na serwery Usługodawcy.
          </p>
        </section>

        {/* Section 3: User Responsibilities */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">3. Obowiązki użytkownika</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Użytkownik zobowiązuje się do:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>Korzystania z Serwisu zgodnie z obowiązującym prawem</li>
            <li>Nieużywania narzędzi do celów niezgodnych z prawem</li>
            <li>Niepodejmowania działań mogących zakłócić działanie Serwisu</li>
            <li>Niekorzystania z automatycznych systemów pobierających treści z Serwisu</li>
            <li>Niepodejmowania prób nieautoryzowanego dostępu do systemów Serwisu</li>
          </ul>
        </section>

        {/* Section 4: Intellectual Property */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
              <Scale className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">4. Własność intelektualna</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Wszystkie elementy Serwisu, w tym:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-4">
            <li>Kod źródłowy i oprogramowanie</li>
            <li>Projekt graficzny i układ strony</li>
            <li>Logo i znaki towarowe</li>
            <li>Treści tekstowe i multimedialne</li>
          </ul>
          <p className="text-muted-foreground">
            stanowią własność Usługodawcy lub są wykorzystywane na podstawie odpowiednich 
            licencji. Kopiowanie, modyfikowanie lub rozpowszechnianie elementów Serwisu 
            bez zgody jest zabronione.
          </p>
        </section>

        {/* Section 5: Disclaimers */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">5. Wyłączenie odpowiedzialności</h2>
          </div>
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-muted-foreground mb-4">
                <strong>Narzędzia są udostępniane "tak jak są" (as is).</strong>
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  Usługodawca nie gwarantuje nieprzerwanego i bezbłędnego działania Serwisu.
                </li>
                <li>
                  Usługodawca nie ponosi odpowiedzialności za wyniki generowane przez narzędzia.
                </li>
                <li>
                  Użytkownik korzysta z narzędzi na własne ryzyko i odpowiedzialność.
                </li>
                <li>
                  Usługodawca nie odpowiada za szkody wynikłe z korzystania lub niemożności 
                  korzystania z Serwisu.
                </li>
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
            <h2 className="text-xl font-bold">6. Ograniczenie odpowiedzialności</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            W maksymalnym zakresie dozwolonym przez prawo:
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              Usługodawca nie ponosi odpowiedzialności za jakiekolwiek szkody pośrednie, 
              przypadkowe, szczególne lub wynikowe.
            </li>
            <li>
              Całkowita odpowiedzialność Usługodawcy jest ograniczona do wartości 
              ewentualnych opłat poniesionych przez Użytkownika (w przypadku Serwisu 
              bezpłatnego - do zera).
            </li>
          </ul>
        </section>

        {/* Section 7: Governing Law */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
              <Scale className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">7. Prawo właściwe</h2>
          </div>
          <p className="text-muted-foreground">
            Niniejszy Regulamin podlega prawu polskiemu. Wszelkie spory wynikające z 
            korzystania z Serwisu będą rozstrzygane przez sądy właściwe dla siedziby 
            Usługodawcy, chyba że przepisy prawa stanowią inaczej.
          </p>
        </section>

        {/* Section 8: Changes */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
              <RefreshCw className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">8. Zmiany Regulaminu</h2>
          </div>
          <p className="text-muted-foreground">
            Usługodawca zastrzega sobie prawo do zmiany niniejszego Regulaminu w dowolnym 
            czasie. Zmiany wchodzą w życie z chwilą opublikowania zaktualizowanej wersji 
            w Serwisie. Dalsze korzystanie z Serwisu po wprowadzeniu zmian oznacza 
            akceptację nowego Regulaminu.
          </p>
        </section>

        {/* Section 9: Contact */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">9. Kontakt</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            W przypadku pytań dotyczących Regulaminu, prosimy o kontakt:
          </p>
          <Card>
            <CardContent className="p-4">
              <p className="text-muted-foreground m-0">
                <strong>Email:</strong>{" "}
                <a href="mailto:kontakt@uttlo.com" className="text-primary hover:underline">
                  kontakt@uttlo.com
                </a>
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Final Note */}
        <Card className="bg-muted/50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground m-0">
              Korzystając z serwisu uttlo.pl, potwierdzasz, że zapoznałeś się z niniejszym 
              Regulaminem i akceptujesz jego postanowienia. Zachęcamy również do zapoznania 
              się z naszą{" "}
              <Link href={`/${locale}/polityka-prywatnosci`} className="text-primary hover:underline">
                Polityką Prywatności
              </Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
