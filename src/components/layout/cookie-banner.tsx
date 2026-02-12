"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getConsent, setConsent, GA_ID } from "@/lib/consent";

const bannerText: Record<string, { message: string; privacyLink: string; reject: string; accept: string }> = {
  pl: {
    message: "Ta strona korzysta z plików cookies i Google Analytics w celu analizy ruchu i ulepszania serwisu. Twoje dane są anonimowe.",
    privacyLink: "Polityka prywatności",
    reject: "Odrzucam",
    accept: "Akceptuję",
  },
  en: {
    message: "This site uses cookies and Google Analytics to analyze traffic and improve the service. Your data is anonymous.",
    privacyLink: "Privacy Policy",
    reject: "Reject",
    accept: "Accept",
  },
};

function getLocaleFromPath(): string {
  if (typeof window === "undefined") return "en";
  const segments = window.location.pathname.split("/").filter(Boolean);
  const locale = segments[0];
  return locale === "pl" ? "pl" : "en";
}

export function CookieBanner() {
  const [consent, setConsentState] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const current = getConsent();
    setConsentState(current);
    setLocale(getLocaleFromPath());
    setLoaded(true);
  }, []);

  const handleAccept = () => {
    setConsent(true);
    setConsentState(true);
  };

  const handleReject = () => {
    setConsent(false);
    setConsentState(false);
  };

  // Don't render anything on server or before hydration
  if (!loaded) return null;

  const t = bannerText[locale] || bannerText.en;

  return (
    <>
      {/* Load GA only if consent is granted */}
      {consent === true && <GoogleAnalytics gaId={GA_ID} />}

      {/* Show banner only if consent hasn't been decided */}
      {consent === null && (
        <div className="fixed bottom-0 inset-x-0 z-[9998] p-4 md:p-6">
          <div className="max-w-3xl mx-auto bg-card border border-border rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 text-sm text-muted-foreground">
                <p>
                  {t.message}{" "}
                  <Link
                    href={`/${locale}/polityka-prywatnosci`}
                    className="underline hover:text-foreground transition-colors"
                  >
                    {t.privacyLink}
                  </Link>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  {t.reject}
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {t.accept}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
