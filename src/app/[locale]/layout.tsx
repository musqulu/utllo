import { notFound } from "next/navigation";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!i18n.locales.includes(locale as Locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale as Locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale} dictionary={dictionary} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} dictionary={dictionary} />
    </div>
  );
}
