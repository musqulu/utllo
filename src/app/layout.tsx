import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { RouteTracker } from "@/components/analytics/route-tracker";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | utllo",
    default: "utllo - Free Online Tools",
  },
  description:
    "Free online tools for everyone. Password generator, vacation countdown, calculators, converters and more. Everything runs in your browser.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://utllo.com"
  ),
  keywords: [
    "online tools",
    "free tools",
    "password generator",
    "vacation countdown",
    "BMI calculator",
    "PDF converter",
    "utllo",
  ],
  authors: [{ name: "utllo" }],
  creator: "utllo",
  publisher: "utllo",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["pl_PL"],
    siteName: "utllo",
    title: "utllo - Free Online Tools",
    description:
      "Free online tools for everyone. Password generator, vacation countdown, calculators, converters and more.",
    url: "https://utllo.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@utllo",
    creator: "@utllo",
    title: "utllo - Free Online Tools",
    description:
      "Free online tools for everyone. Password generator, vacation countdown, calculators, converters and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <CookieBanner />
        <RouteTracker />
      </body>
    </html>
  );
}
