import { Metadata } from "next";
import { Zap, Shield, UserX } from "lucide-react";
import { i18n, Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { tools, getToolUrl } from "@/lib/tools";
import { CategoryTabs } from "@/components/layout/category-tabs";
import { JsonLd, generateItemListSchema, generateWebsiteSchema } from "@/components/seo/json-ld";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);

  return {
    title: `${dictionary.home.title} | ${dictionary.brand}`,
    description: dictionary.home.subtitle,
    openGraph: {
      title: `${dictionary.home.title} | ${dictionary.brand}`,
      description: dictionary.home.subtitle,
      type: "website",
      locale: locale === "pl" ? "pl_PL" : "en_US",
    },
  };
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as Locale);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://uttlo.com";

  const websiteSchema = generateWebsiteSchema({
    name: dictionary.brand,
    url: `${baseUrl}/${locale}`,
    description: dictionary.home.subtitle,
  });

  const toolsList = tools.map((tool) => ({
    name: (dictionary.tools as Record<string, { name?: string }>)[tool.id]?.name || tool.id,
    url: `${baseUrl}${getToolUrl(tool, locale)}`,
  }));

  const itemListSchema = generateItemListSchema({
    name: dictionary.home.title,
    description: dictionary.home.subtitle,
    items: toolsList,
  });

  return (
    <>
      <JsonLd data={websiteSchema} />
      <JsonLd data={itemListSchema} />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {dictionary.home.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            {dictionary.home.subtitle}
          </p>
        </section>

        {/* Tools with Category Tabs */}
        <section className="mb-16">
          <CategoryTabs locale={locale} dictionary={dictionary} />
        </section>

        {/* Why Us Section */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {dictionary.home.whyUs.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fast & Free */}
            <div className="text-center">
              <div className="inline-flex rounded-full bg-primary/10 p-3 mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">
                {dictionary.home.whyUs.fast.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dictionary.home.whyUs.fast.description}
              </p>
            </div>

            {/* Secure */}
            <div className="text-center">
              <div className="inline-flex rounded-full bg-primary/10 p-3 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">
                {dictionary.home.whyUs.secure.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dictionary.home.whyUs.secure.description}
              </p>
            </div>

            {/* No Registration */}
            <div className="text-center">
              <div className="inline-flex rounded-full bg-primary/10 p-3 mb-4">
                <UserX className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">
                {dictionary.home.whyUs.noRegister.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dictionary.home.whyUs.noRegister.description}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
