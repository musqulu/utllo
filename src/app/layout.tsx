import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | uttlo",
    default: "uttlo - Darmowe Narzędzia Online",
  },
  description:
    "Darmowe narzędzia online dla każdego. Generator haseł, odliczanie do wakacji, kalkulatory, konwertery i wiele więcej. Wszystko działa w przeglądarce.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://uttlo.com"
  ),
  keywords: [
    "narzędzia online",
    "darmowe narzędzia",
    "generator haseł",
    "odliczanie do wakacji",
    "kalkulator BMI",
    "konwerter PDF",
    "uttlo",
  ],
  authors: [{ name: "uttlo" }],
  creator: "uttlo",
  publisher: "uttlo",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "uttlo",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@uttlo",
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
    <html lang="pl" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
