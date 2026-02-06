import { Metadata } from "next";
import Link from "next/link";
import { Zap, Target, Users, Code, Heart, Sparkles } from "lucide-react";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

const BASE_URL = "https://uttlo.com";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: "O nas - Kim jesteśmy | uttlo",
    description: "Poznaj uttlo - darmowe narzędzia online dla każdego. Dowiedz się o naszej misji, technologii i dlaczego tworzymy bezpłatne narzędzia internetowe.",
    alternates: {
      canonical: `${BASE_URL}/${locale}/o-nas`,
    },
    openGraph: {
      title: "O nas - Kim jesteśmy | uttlo",
      description: "Poznaj uttlo - darmowe narzędzia online dla każdego.",
      url: `${BASE_URL}/${locale}/o-nas`,
      type: "website",
      locale: "pl_PL",
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);

  const breadcrumbItems = [
    { name: dictionary.nav.home, url: `/${locale}` },
    { name: "O nas", url: `/${locale}/o-nas` },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <Breadcrumbs items={breadcrumbItems} className="mb-8" />

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 shadow-lg shadow-indigo-500/25">
            <Zap className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          O nas
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Tworzymy darmowe narzędzia online, które ułatwiają codzienną pracę
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto mb-16">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Nasza misja</h2>
                <p className="text-muted-foreground mb-4">
                  <strong>uttlo</strong> powstało z prostej idei: każdy powinien mieć dostęp do 
                  przydatnych narzędzi online bez konieczności płacenia, rejestracji czy instalacji 
                  oprogramowania.
                </p>
                <p className="text-muted-foreground">
                  Wierzymy, że technologia powinna być dostępna dla wszystkich. Dlatego tworzymy 
                  narzędzia, które działają bezpośrednio w przeglądarce, są szybkie, bezpieczne 
                  i całkowicie darmowe.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* What We Offer */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Co oferujemy?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600 w-fit mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Generatory</h3>
              <p className="text-sm text-muted-foreground">
                Generator haseł, Lorem Ipsum, UUID, QR kodów i wiele innych narzędzi 
                do szybkiego tworzenia potrzebnych danych.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="p-3 rounded-lg bg-green-500/10 text-green-600 w-fit mb-4">
                <Code className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Konwertery</h3>
              <p className="text-sm text-muted-foreground">
                Konwersja plików PDF, obrazów i dokumentów. Wszystko działa lokalnie 
                w Twojej przeglądarce - pliki nie są wysyłane na serwer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="p-3 rounded-lg bg-orange-500/10 text-orange-600 w-fit mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Losowania</h3>
              <p className="text-sm text-muted-foreground">
                Losuj liczby, cytaty, karty tarota czy podejmuj decyzje. Idealne 
                do gier, konkursów i codziennych wyborów.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-600 w-fit mb-4">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Kalkulatory</h3>
              <p className="text-sm text-muted-foreground">
                Kalkulator BMI, proporcji, średniej ważonej i inne przydatne 
                narzędzia do obliczeń matematycznych.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technology */}
      <section className="max-w-4xl mx-auto mb-16">
        <Card className="bg-muted/50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Nasza technologia</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">
                  Działanie w przeglądarce - bez wysyłania danych na serwer
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">0 zł</div>
                <p className="text-sm text-muted-foreground">
                  Wszystkie narzędzia są całkowicie darmowe
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">0</div>
                <p className="text-sm text-muted-foreground">
                  Rejestracji wymaganych - korzystaj od razu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer CTA */}
      <section className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
          <span>Stworzone z</span>
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          <span>w Polsce</span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Masz pytania lub sugestie? Skontaktuj się z nami!
        </p>
        <Link
          href={`/${locale}/kontakt`}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Kontakt
        </Link>
      </section>
    </div>
  );
}
