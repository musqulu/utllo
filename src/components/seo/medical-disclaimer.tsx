/** E-E-A-T: health tools are informational only — not medical advice */
export function MedicalDisclaimer({ locale }: { locale: string }) {
  const isEn = locale === "en";
  return (
    <div className="mt-8 max-w-2xl mx-auto rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-muted-foreground">
      <p className="font-medium text-foreground mb-1">
        {isEn ? "Medical disclaimer" : "Zastrzeżenie medyczne"}
      </p>
      <p>
        {isEn
          ? "This tool is for educational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider about your health."
          : "To narzędzie ma charakter wyłącznie edukacyjny i nie zastępuje porady lekarskiej, diagnozy ani leczenia. W sprawach zdrowia skonsultuj się z lekarzem lub innym wykwalifikowanym specjalistą."}
      </p>
    </div>
  );
}
