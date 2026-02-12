import { Metadata } from "next";
import { Shield, Database, Cookie, Eye, UserCheck, Mail } from "lucide-react";
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
    title: isEn ? "Privacy Policy | utllo" : "Polityka Prywatności | utllo",
    description: isEn
      ? "Privacy policy of utllo. Learn how we protect your data and what information we collect when you use our free online tools."
      : "Polityka prywatności serwisu utllo. Dowiedz się, jak chronimy Twoje dane i jakie informacje zbieramy podczas korzystania z naszych narzędzi online.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/polityka-prywatnosci`,
    },
    openGraph: {
      title: isEn ? "Privacy Policy | utllo" : "Polityka Prywatności | utllo",
      description: isEn
        ? "Privacy policy of utllo. Learn how we protect your data."
        : "Polityka prywatności serwisu utllo. Dowiedz się, jak chronimy Twoje dane.",
      url: `${BASE_URL}/${locale}/polityka-prywatnosci`,
      type: "website",
      locale: isEn ? "en_US" : "pl_PL",
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const isEn = locale === "en";

  const breadcrumbItems = [
    { name: dictionary.nav.home, url: `/${locale}` },
    { name: isEn ? "Privacy Policy" : "Polityka prywatności", url: `/${locale}/polityka-prywatnosci` },
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
          {isEn ? "Privacy Policy" : "Polityka Prywatności"}
        </h1>
        <p className="text-muted-foreground">
          {isEn ? "Last updated" : "Ostatnia aktualizacja"}: {LAST_UPDATED[locale] || LAST_UPDATED.en}
        </p>
      </section>

      <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground m-0">
              {isEn ? (
                <>
                  This Privacy Policy describes how <strong>utllo.com</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, and protects information when you use our services. We respect your privacy and are committed to protecting it.
                </>
              ) : (
                <>
                  Niniejsza Polityka Prywatności opisuje, w jaki sposób serwis <strong>utllo.pl</strong> (&quot;my&quot;, &quot;nas&quot;, &quot;nasz&quot;) zbiera, wykorzystuje i chroni informacje podczas korzystania z naszych usług. Szanujemy Twoją prywatność i zobowiązujemy się do jej ochrony.
                </>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Section 1: Administrator */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <UserCheck className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold m-0">
              {isEn ? "1. Data Controller" : "1. Administrator danych"}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {isEn ? (
              <>
                The data controller is the owner of utllo.com. For matters related to the protection of personal data, you can contact us at: <a href="mailto:kontakt@utllo.com" className="text-primary hover:underline">kontakt@utllo.com</a>
              </>
            ) : (
              <>
                Administratorem danych osobowych jest właściciel serwisu utllo.pl. W sprawach związanych z ochroną danych osobowych można kontaktować się pod adresem: <a href="mailto:kontakt@utllo.com" className="text-primary hover:underline">kontakt@utllo.com</a>
              </>
            )}
          </p>
        </section>

        {/* Section 2: Data Collection */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold m-0">
              {isEn ? "2. What data do we collect?" : "2. Jakie dane zbieramy?"}
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {isEn ? (
              <>
                <strong>utllo</strong> was designed with privacy in mind. Most of our tools run entirely in your browser, which means:
              </>
            ) : (
              <>
                <strong>utllo</strong> zostało zaprojektowane z myślą o prywatności. Większość naszych narzędzi działa całkowicie w Twojej przeglądarce, co oznacza, że:
              </>
            )}
          </p>
          <ul className="text-muted-foreground space-y-2">
            {isEn ? (
              <>
                <li>
                  <strong>Tool data:</strong> Text, passwords, files, and other data you enter into our tools are NOT sent to our servers. Processing happens locally in your browser.
                </li>
                <li>
                  <strong>Technical data:</strong> We may collect anonymous statistical data such as browser type, operating system, visit duration, and pages visited for analytical purposes.
                </li>
                <li>
                  <strong>Contact data:</strong> If you contact us by email, we store your email address and message content in order to respond.
                </li>
              </>
            ) : (
              <>
                <li>
                  <strong>Dane z narzędzi:</strong> Tekst, hasła, pliki i inne dane wprowadzane do naszych narzędzi NIE są wysyłane na nasze serwery. Przetwarzanie odbywa się lokalnie w Twojej przeglądarce.
                </li>
                <li>
                  <strong>Dane techniczne:</strong> Możemy zbierać anonimowe dane statystyczne, takie jak typ przeglądarki, system operacyjny, czas wizyty i odwiedzane strony w celach analitycznych.
                </li>
                <li>
                  <strong>Dane kontaktowe:</strong> Jeśli skontaktujesz się z nami przez email, przechowujemy Twój adres email i treść wiadomości w celu udzielenia odpowiedzi.
                </li>
              </>
            )}
          </ul>
        </section>

        {/* Section 3: Cookies */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
              <Cookie className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold m-0">
              {isEn ? "3. Cookies" : "3. Pliki cookies"}
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {isEn ? (
              <>
                Our website uses cookies. On your first visit, we display a banner requesting consent for cookies. Analytics cookies are loaded <strong>only after you give consent</strong>.
              </>
            ) : (
              <>
                Nasza strona wykorzystuje pliki cookies. Przy pierwszej wizycie wyświetlamy baner z prośbą o zgodę na pliki cookies. Analityczne cookies są ładowane <strong>wyłącznie po wyrażeniu zgody</strong> przez użytkownika.
              </>
            )}
          </p>
          <ul className="text-muted-foreground space-y-2">
            {isEn ? (
              <>
                <li>
                  <strong>Essential cookies:</strong> Required for the website to function properly (e.g., remembering language preferences and your cookie consent decision).
                </li>
                <li>
                  <strong>Analytics cookies (Google Analytics):</strong> Help us understand how visitors use the site. Collected data is anonymous and includes information about pages visited, time on site, device, and traffic source. These cookies are only activated after clicking &quot;Accept&quot; on the cookie banner.
                </li>
              </>
            ) : (
              <>
                <li>
                  <strong>Niezbędne cookies:</strong> Wymagane do prawidłowego działania strony (np. zapamiętanie preferencji językowych i Twojej decyzji dotyczącej cookies).
                </li>
                <li>
                  <strong>Analityczne cookies (Google Analytics):</strong> Pomagają nam zrozumieć, jak użytkownicy korzystają z serwisu. Zbierane dane są anonimowe i obejmują informacje o odwiedzanych stronach, czasie spędzonym na stronie, urządzeniu i źródle ruchu. Te cookies są aktywowane tylko po kliknięciu &quot;Akceptuję&quot; w banerze cookie.
                </li>
              </>
            )}
          </ul>
          <p className="text-muted-foreground mt-4">
            {isEn
              ? "Your cookie decision is stored in your browser's local storage (localStorage). To change your decision, clear the site data in your browser settings — the banner will appear again on your next visit."
              : "Twoja decyzja dotycząca cookies jest zapisywana w pamięci przeglądarki (localStorage). Aby zmienić swoją decyzję, wyczyść dane strony w ustawieniach przeglądarki - baner zostanie wyświetlony ponownie przy następnej wizycie."}
          </p>
        </section>

        {/* Section 4: Third Party */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
              <Eye className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold m-0">
              {isEn ? "4. Third-party services" : "4. Usługi zewnętrzne"}
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {isEn ? (
              <>
                We use <strong>Google Analytics 4</strong> (GA4) by Google Ireland Limited to collect anonymous traffic statistics. Google Analytics is loaded only after the user gives consent via the cookie banner.
              </>
            ) : (
              <>
                Korzystamy z usługi <strong>Google Analytics 4</strong> (GA4) firmy Google Ireland Limited w celu zbierania anonimowych statystyk dotyczących ruchu na stronie. Google Analytics jest ładowane wyłącznie po wyrażeniu zgody przez użytkownika za pomocą banera cookie.
              </>
            )}
          </p>
          <p className="text-muted-foreground">
            {isEn ? (
              <>
                Google Analytics collects data such as: pages visited, time spent on site, device type, browser, country, and traffic source. This data is anonymous and does not allow identification of individual users. For more information, see{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  Google&apos;s Privacy Policy
                </a>.
              </>
            ) : (
              <>
                Google Analytics zbiera dane takie jak: odwiedzane strony, czas spędzony na stronie, typ urządzenia, przeglądarka, kraj i źródło ruchu. Dane te są anonimowe i nie pozwalają na identyfikację konkretnego użytkownika. Więcej informacji znajdziesz w{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground transition-colors"
                >
                  Polityce prywatności Google
                </a>.
              </>
            )}
          </p>
        </section>

        {/* Section 5: User Rights */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
              <UserCheck className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold m-0">
              {isEn ? "5. Your rights (GDPR)" : "5. Twoje prawa (RODO)"}
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {isEn
              ? "Under the General Data Protection Regulation (GDPR), you have the following rights:"
              : "Zgodnie z Rozporządzeniem o Ochronie Danych Osobowych (RODO), przysługują Ci następujące prawa:"}
          </p>
          <ul className="text-muted-foreground space-y-2">
            {isEn ? (
              <>
                <li><strong>Right of access</strong> — you can request information about the data we process</li>
                <li><strong>Right to rectification</strong> — you can request correction of inaccurate data</li>
                <li><strong>Right to erasure</strong> — you can request deletion of your data (&quot;right to be forgotten&quot;)</li>
                <li><strong>Right to restrict processing</strong> — you can request limitation of data processing</li>
                <li><strong>Right to data portability</strong> — you can request your data in a structured format</li>
                <li><strong>Right to object</strong> — you can object to data processing</li>
              </>
            ) : (
              <>
                <li><strong>Prawo dostępu</strong> - możesz żądać informacji o przetwarzanych danych</li>
                <li><strong>Prawo do sprostowania</strong> - możesz żądać poprawienia nieprawidłowych danych</li>
                <li><strong>Prawo do usunięcia</strong> - możesz żądać usunięcia swoich danych (&quot;prawo do bycia zapomnianym&quot;)</li>
                <li><strong>Prawo do ograniczenia przetwarzania</strong> - możesz żądać ograniczenia przetwarzania danych</li>
                <li><strong>Prawo do przenoszenia danych</strong> - możesz żądać przekazania danych w ustrukturyzowanym formacie</li>
                <li><strong>Prawo do sprzeciwu</strong> - możesz sprzeciwić się przetwarzaniu danych</li>
              </>
            )}
          </ul>
        </section>

        {/* Section 6: Contact */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold m-0">
              {isEn ? "6. Privacy contact" : "6. Kontakt w sprawach prywatności"}
            </h2>
          </div>
          <p className="text-muted-foreground">
            {isEn
              ? "If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:"
              : "W przypadku pytań dotyczących niniejszej Polityki Prywatności lub chęci skorzystania z przysługujących Ci praw, prosimy o kontakt:"}
          </p>
          <Card className="mt-4">
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

        {/* Section 7: Changes */}
        <section>
          <h2 className="text-xl font-bold mb-4">
            {isEn ? "7. Changes to this Privacy Policy" : "7. Zmiany w Polityce Prywatności"}
          </h2>
          <p className="text-muted-foreground">
            {isEn
              ? "We reserve the right to make changes to this Privacy Policy. We will notify you of any significant changes by updating the date at the top of this document. We recommend checking this page regularly."
              : "Zastrzegamy sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatności. O wszelkich istotnych zmianach będziemy informować poprzez aktualizację daty na początku dokumentu. Zalecamy regularne sprawdzanie tej strony."}
          </p>
        </section>
      </div>
    </div>
  );
}
