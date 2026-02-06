import { Metadata } from "next";
import { Mail, MessageSquare, Clock, HelpCircle } from "lucide-react";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

const BASE_URL = "https://uttlo.com";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "Kontakt - Skontaktuj się z nami | uttlo",
    description: "Masz pytanie, sugestię lub problem? Skontaktuj się z zespołem uttlo. Odpowiadamy na wiadomości w ciągu 24-48 godzin.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/kontakt`,
    },
    openGraph: {
      title: "Kontakt - Skontaktuj się z nami | uttlo",
      description: "Masz pytanie, sugestię lub problem? Skontaktuj się z zespołem uttlo.",
      url: `${BASE_URL}/${locale}/kontakt`,
      type: "website",
      locale: "pl_PL",
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);

  const breadcrumbItems = [
    { name: dictionary.nav.home, url: `/${locale}` },
    { name: "Kontakt", url: `/${locale}/kontakt` },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={breadcrumbItems} className="mb-8" />

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Kontakt
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Masz pytanie, sugestię lub chcesz zgłosić problem? Napisz do nas!
        </p>
      </section>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-2">
                <Mail className="h-6 w-6" />
              </div>
              <CardTitle>Email</CardTitle>
              <CardDescription>
                Preferowany sposób kontaktu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a 
                href="mailto:kontakt@uttlo.com" 
                className="text-lg font-medium text-primary hover:underline"
              >
                kontakt@uttlo.com
              </a>
              <p className="text-sm text-muted-foreground mt-2">
                Pisz śmiało w sprawie pytań, sugestii nowych narzędzi lub zgłoszeń błędów.
              </p>
            </CardContent>
          </Card>

          {/* Response Time Card */}
          <Card>
            <CardHeader>
              <div className="p-3 rounded-lg bg-green-500/10 text-green-600 w-fit mb-2">
                <Clock className="h-6 w-6" />
              </div>
              <CardTitle>Czas odpowiedzi</CardTitle>
              <CardDescription>
                Kiedy możesz spodziewać się odpowiedzi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">24-48 godzin</p>
              <p className="text-sm text-muted-foreground mt-2">
                Staramy się odpowiadać na wszystkie wiadomości w ciągu 1-2 dni roboczych.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What to include */}
        <Card className="mb-12">
          <CardHeader>
            <div className="p-3 rounded-lg bg-orange-500/10 text-orange-600 w-fit mb-2">
              <MessageSquare className="h-6 w-6" />
            </div>
            <CardTitle>Co zawrzeć w wiadomości?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">1</span>
                <span><strong>Temat:</strong> Krótki opis sprawy (np. "Sugestia nowego narzędzia", "Błąd w generatorze haseł")</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">2</span>
                <span><strong>Opis:</strong> Szczegółowy opis pytania, sugestii lub problemu</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">3</span>
                <span><strong>Przeglądarka:</strong> Jeśli zgłaszasz błąd, podaj nazwę i wersję przeglądarki</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* FAQ */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-600">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">Często zadawane pytania</h2>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Czy mogę zaproponować nowe narzędzie?</h3>
                <p className="text-sm text-muted-foreground">
                  Tak! Chętnie wysłuchamy Twoich pomysłów. Napisz do nas z opisem narzędzia, 
                  które chciałbyś zobaczyć na uttlo.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Znalazłem błąd - co robić?</h3>
                <p className="text-sm text-muted-foreground">
                  Zgłoś go na nasz adres email. Opisz co próbowałeś zrobić, co się stało 
                  i jakiej przeglądarki używasz. To pomoże nam szybko naprawić problem.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Czy oferujecie współpracę lub reklamy?</h3>
                <p className="text-sm text-muted-foreground">
                  Rozważamy propozycje współpracy. Napisz do nas z opisem Twojej propozycji, 
                  a odpowiemy w ciągu kilku dni.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
