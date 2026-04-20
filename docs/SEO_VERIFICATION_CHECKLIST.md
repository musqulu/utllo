# SEO verification checklist (manual)

Use this with Google Search Console and external tools after deploy.

## Google Search Console

- [ ] **Performance** — Pages report: top URLs by clicks/impressions (export CSV).
- [ ] **Indexing → Pages** — drill into each “Why pages aren’t indexed” reason; export affected URLs for “Page with redirect”, “Redirect error”, “Crawled – currently not indexed”.
- [ ] **Manual actions** — confirm none.
- [ ] **Security issues** — confirm none.
- [ ] **Experience** — Core Web Vitals (mobile/desktop) once URLs have enough traffic.
- [ ] **Links** — external links report (optional backlink snapshot in Ahrefs/SEMrush).

## PageSpeed / CWV

- [ ] PSI for `/`, `/kalkulatory/kalkulator-bmi`, `/losuj/rzut-kostka`, `/en/contact`.

## Redirects

- [ ] `curl -I` Polish flat legacy URLs, e.g. `/lorem-ipsum` → 301 → `/generatory/generator-lorem-ipsum`.
- [ ] `curl -I` `/en/kontakt` → 301 → `/en/contact`.

## Locale

- [ ] Sitemap `https://utllo.com/sitemap.xml` lists PL + EN alternates without `x-default` on Polish-only assumptions.
- [ ] Hreflang `pl-PL` / `en` on homepage view-source.
