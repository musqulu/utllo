import { Metadata } from "next";
import { Shield, Database, Cookie, Eye, UserCheck, Mail } from "lucide-react";
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
    title: "Polityka Prywatności | uttlo",
    description: "Polityka prywatności serwisu uttlo. Dowiedz się, jak chronimy Twoje dane i jakie informacje zbieramy podczas korzystania z naszych narzędzi online.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/polityka-prywatnosci`,
    },
    openGraph: {
      title: "Polityka Prywatności | uttlo",
      description: "Polityka prywatności serwisu uttlo. Dowiedz się, jak chronimy Twoje dane.",
      url: `${BASE_URL}/${locale}/polityka-prywatnosci`,
      type: "website",
      locale: "pl_PL",
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);

  const breadcrumbItems = [
    { name: dictionary.nav.home, url: `/${locale}` },
    { name: "Polityka prywatności", url: `/${locale}/polityka-prywatnosci` },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={breadcrumbItems} className="mb-8" />

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="p-3 rounded-lg bg-green-500/10 text-green-600">
            <Shield className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Polityka Prywatności
        </h1>
        <p className="text-muted-foreground">
          Ostatnia aktualizacja: {LAST_UPDATED}
        </p>
      </section>

      <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground m-0">
              Niniejsza Polityka Prywatności opisuje, w jaki sposób serwis <strong>uttlo.pl</strong> 
              ("my", "nas", "nasz") zbiera, wykorzystuje i chroni informacje podczas korzystania 
              z naszych usług. Szanujemy Twoją prywatność i zobowiązujemy się do jej ochrony.
            </p>
          </CardContent>
        </Card>

        {/* Section 1: Administrator */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <UserCheck className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold m-0">1. Administrator danych</h2>
          </div>
          <p className="text-muted-foreground">
            Administratorem danych osobowych jest właściciel serwisu uttlo.pl. 
            W sprawach związanych z ochroną danych osobowych można kontaktować się 
            pod adresem: <a href="mailto:kontakt@uttlo.com" className="text-primary hover:underline">kontakt@uttlo.com</a>
          </p>
        </section>

        {/* Section 2: Data Collection */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold m-0">2. Jakie dane zbieramy?</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            <strong>uttlo</strong> zostało zaprojektowane z myślą o prywatności. 
            Większość naszych narzędzi działa całkowicie w Twojej przeglądarce, 
            co oznacza, że:
          </p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <strong>Dane z narzędzi:</strong> Tekst, hasła, pliki i inne dane wprowadzane 
              do naszych narzędzi NIE są wysyłane na nasze serwery. Przetwarzanie odbywa się 
              lokalnie w Twojej przeglądarce.
            </li>
            <li>
              <strong>Dane techniczne:</strong> Możemy zbierać anonimowe dane statystyczne, 
              takie jak typ przeglądarki, system operacyjny, czas wizyty i odwiedzane strony 
              w celach analitycznych.
            </li>
            <li>
              <strong>Dane kontaktowe:</strong> Jeśli skontaktujesz się z nami przez email, 
              przechowujemy Twój adres email i treść wiadomości w celu udzielenia odpowiedzi.
            </li>
          </ul>
        </section>

        {/* Section 3: Cookies */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
              <Cookie className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold m-0">3. Pliki cookies</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Nasza strona może wykorzystywać pliki cookies w następujących celach:
          </p>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <strong>Niezbędne cookies:</strong> Wymagane do prawidłowego działania strony 
              (np. zapamiętanie preferencji językowych).
            </li>
            <li>
              <strong>Analityczne cookies:</strong> Pomagają nam zrozumieć, jak użytkownicy 
              korzystają z serwisu, co pozwala nam go ulepszać.
            </li>
          </ul>
          <p className="text-muted-foreground mt-4">
            Możesz zarządzać plikami cookies w ustawieniach swojej przeglądarki. 
            Wyłączenie niektórych cookies może wpłynąć na funkcjonalność strony.
          </p>
        </section>

        {/* Section 4: Third Party */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
              <Eye className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold m-0">4. Usługi zewnętrzne</h2>
          </div>
          <p className="text-muted-foreground">
            Możemy korzystać z zewnętrznych usług analitycznych (np. Google Analytics) 
            w celu zbierania anonimowych statystyk dotyczących ruchu na stronie. 
            Te usługi mogą wykorzystywać własne pliki cookies zgodnie z ich politykami 
            prywatności.
          </p>
        </section>

        {/* Section 5: User Rights */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
              <UserCheck className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold m-0">5. Twoje prawa (RODO)</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Zgodnie z Rozporządzeniem o Ochronie Danych Osobowych (RODO), przysługują Ci 
            następujące prawa:
          </p>
          <ul className="text-muted-foreground space-y-2">
            <li><strong>Prawo dostępu</strong> - możesz żądać informacji o przetwarzanych danych</li>
            <li><strong>Prawo do sprostowania</strong> - możesz żądać poprawienia nieprawidłowych danych</li>
            <li><strong>Prawo do usunięcia</strong> - możesz żądać usunięcia swoich danych ("prawo do bycia zapomnianym")</li>
            <li><strong>Prawo do ograniczenia przetwarzania</strong> - możesz żądać ograniczenia przetwarzania danych</li>
            <li><strong>Prawo do przenoszenia danych</strong> - możesz żądać przekazania danych w ustrukturyzowanym formacie</li>
            <li><strong>Prawo do sprzeciwu</strong> - możesz sprzeciwić się przetwarzaniu danych</li>
          </ul>
        </section>

        {/* Section 6: Contact */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold m-0">6. Kontakt w sprawach prywatności</h2>
          </div>
          <p className="text-muted-foreground">
            W przypadku pytań dotyczących niniejszej Polityki Prywatności lub chęci 
            skorzystania z przysługujących Ci praw, prosimy o kontakt:
          </p>
          <Card className="mt-4">
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

        {/* Section 7: Changes */}
        <section>
          <h2 className="text-xl font-bold mb-4">7. Zmiany w Polityce Prywatności</h2>
          <p className="text-muted-foreground">
            Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności. 
            O wszelkich istotnych zmianach będziemy informować poprzez aktualizację daty 
            na początku dokumentu. Zalecamy regularne sprawdzanie tej strony.
          </p>
        </section>
      </div>
    </div>
  );
}
