# English locale (`/en`) strategy

**Decision:** Keep English routes **indexed** in `sitemap.xml` and available to crawlers.

Rationale:

- Hreflang is implemented with `pl-PL`, `en`, and `x-default` pointing at the English URL. This gives Google a fallback for non-PL/EN audiences without claiming Polish is the global default.
- English URLs use dedicated slugs (`/en/contact`, `/en/about`, `/en/terms`, `/en/privacy`) to avoid mixed-language paths.
- Further ranking gains require **deeper English copy** and backlinks; if resources are limited, prioritize Polish content first rather than `noindex` on `/en`.

To **noindex** English later (not recommended without product sign-off): add `robots: { index: false }` to `[locale]/layout.tsx` when `locale === 'en'`, and remove `/en` URLs from `sitemap.ts`.
