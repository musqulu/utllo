import { Metadata } from "next";
import { buildHreflangAlternates } from "@/lib/i18n/hreflang";
import { getStaticPagePath } from "@/lib/i18n/static-pages";
import { ContactPageBody } from "@/components/static-pages/contact-page-body";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://utllo.com";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await params;
  const languages = buildHreflangAlternates(BASE_URL, (loc) =>
    getStaticPagePath("contact", loc)
  );

  return {
    title: "Contact Us | utllo",
    description:
      "Have a question, suggestion, or problem? Contact the utllo team. We respond to messages within 24-48 hours.",
    alternates: {
      canonical: `${BASE_URL}/en/contact`,
      languages,
    },
    openGraph: {
      title: "Contact Us | utllo",
      description: "Have a question, suggestion, or problem? Contact the utllo team.",
      url: `${BASE_URL}/en/contact`,
      type: "website",
      locale: "en_US",
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: "en" }];
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  return <ContactPageBody locale={locale} />;
}
