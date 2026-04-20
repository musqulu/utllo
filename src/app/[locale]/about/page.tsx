import { Metadata } from "next";
import Link from "next/link";
import { Zap, Target, Users, Code, Heart, Sparkles, FileCheck } from "lucide-react";
import { Locale, getLocalePath } from "@/lib/i18n/config";
import { buildHreflangAlternates } from "@/lib/i18n/hreflang";
import { getStaticPagePath } from "@/lib/i18n/static-pages";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://utllo.com";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await params;
  const languages = buildHreflangAlternates(BASE_URL, (loc) =>
    getStaticPagePath("about", loc)
  );

  return {
    title: "About Us | utllo",
    description:
      "Discover utllo - free online tools for everyone. Learn about our mission, technology, and why we build free internet tools.",
    alternates: {
      canonical: `${BASE_URL}/en/about`,
      languages,
    },
    openGraph: {
      title: "About Us | utllo",
      description: "Discover utllo - free online tools for everyone.",
      url: `${BASE_URL}/en/about`,
      type: "website",
      locale: "en_US",
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: "en" }];
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const isEn = locale === "en";

  const lp = getLocalePath(locale);
  const breadcrumbItems = [
    { name: dictionary.nav.home, url: lp || "/" },
    { name: "About us", url: `${lp}/about` },
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
          {isEn ? "About Us" : "O nas"}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          {isEn
            ? "We create free online tools that make everyday work easier"
            : "Tworzymy darmowe narzędzia online, które ułatwiają codzienną pracę"}
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
                <h2 className="text-2xl font-bold mb-4">
                  {isEn ? "Our mission" : "Nasza misja"}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {isEn ? (
                    <>
                      <strong>utllo</strong> was born from a simple idea: everyone should have access to useful online tools without having to pay, register, or install software.
                    </>
                  ) : (
                    <>
                      <strong>utllo</strong> powstało z prostej idei: każdy powinien mieć dostęp do przydatnych narzędzi online bez konieczności płacenia, rejestracji czy instalacji oprogramowania.
                    </>
                  )}
                </p>
                <p className="text-muted-foreground">
                  {isEn
                    ? "We believe technology should be accessible to everyone. That's why we build tools that run directly in your browser, are fast, secure, and completely free."
                    : "Wierzymy, że technologia powinna być dostępna dla wszystkich. Dlatego tworzymy narzędzia, które działają bezpośrednio w przeglądarce, są szybkie, bezpieczne i całkowicie darmowe."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Editorial & trust */}
      <section className="max-w-4xl mx-auto mb-16">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Editorial standards</h2>
                <p className="text-muted-foreground mb-4">
                  Tool descriptions and on-page explainers are written for <strong>education and clarity</strong>.
                  We revise copy when formulas or guidance change (e.g. WHO categories) or when we fix mistakes.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Health-related calculators</strong> (BMI, calories, sleep, blood type) are for orientation
                  only; they <strong>do not replace professional medical advice, diagnosis or treatment</strong>.
                  Always speak to a qualified clinician for health decisions.
                </p>
                <p className="text-sm text-muted-foreground">
                  Publisher & editorial: <strong>the utllo team</strong> (Poland). Contact via the Contact page.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* What We Offer */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          {isEn ? "What we offer" : "Co oferujemy?"}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-600 w-fit mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {isEn ? "Generators" : "Generatory"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEn
                  ? "Password generator, Lorem Ipsum, QR codes and many other tools for quickly creating the data you need."
                  : "Generator haseł, Lorem Ipsum, QR kodów i wiele innych narzędzi do szybkiego tworzenia potrzebnych danych."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="p-3 rounded-lg bg-green-500/10 text-green-600 w-fit mb-4">
                <Code className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {isEn ? "Converters" : "Konwertery"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEn
                  ? "Convert PDF files, images and documents. Everything runs locally in your browser — files are never sent to a server."
                  : "Konwersja plików PDF, obrazów i dokumentów. Wszystko działa lokalnie w Twojej przeglądarce - pliki nie są wysyłane na serwer."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="p-3 rounded-lg bg-orange-500/10 text-orange-600 w-fit mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {isEn ? "Randomizers" : "Losowania"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEn
                  ? "Draw random numbers, quotes, tarot cards or make decisions. Perfect for games, contests and everyday choices."
                  : "Losuj liczby, cytaty, karty tarota czy podejmuj decyzje. Idealne do gier, konkursów i codziennych wyborów."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="p-3 rounded-lg bg-purple-500/10 text-purple-600 w-fit mb-4">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {isEn ? "Calculators" : "Kalkulatory"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isEn
                  ? "BMI calculator, proportions, weighted average and other useful tools for mathematical calculations."
                  : "Kalkulator BMI, proporcji, średniej ważonej i inne przydatne narzędzia do obliczeń matematycznych."}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technology */}
      <section className="max-w-4xl mx-auto mb-16">
        <Card className="bg-muted/50">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isEn ? "Our technology" : "Nasza technologia"}
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">
                  {isEn
                    ? "Runs in browser — no data sent to a server"
                    : "Działanie w przeglądarce - bez wysyłania danych na serwer"}
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{isEn ? "$0" : "0 zł"}</div>
                <p className="text-sm text-muted-foreground">
                  {isEn
                    ? "All tools are completely free"
                    : "Wszystkie narzędzia są całkowicie darmowe"}
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">0</div>
                <p className="text-sm text-muted-foreground">
                  {isEn
                    ? "Registrations required — use right away"
                    : "Rejestracji wymaganych - korzystaj od razu"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer CTA */}
      <section className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
          <span>{isEn ? "Made with" : "Stworzone z"}</span>
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          <span>{isEn ? "in Poland" : "w Polsce"}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          {isEn
            ? "Have questions or suggestions? Get in touch!"
            : "Masz pytania lub sugestie? Skontaktuj się z nami!"}
        </p>
        <Link
          href={getStaticPagePath("contact", locale)}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Contact
        </Link>
      </section>
    </div>
  );
}
