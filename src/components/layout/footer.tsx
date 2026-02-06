import Link from "next/link";
import { Zap, Heart } from "lucide-react";
import { getToolsByCategory, getToolUrl, getCategoryUrl, Tool } from "@/lib/tools";

interface FooterProps {
  locale: string;
  dictionary: {
    brand: string;
    tagline?: string;
    categories: {
      tools: string;
      converters: string;
      randomizers: string;
      calculators: string;
    };
    tools: Record<string, { name: string; description: string }>;
    footer: {
      rights: string;
      privacy: string;
      contact: string;
      about?: string;
      terms?: string;
      description?: string;
      categories?: string;
      popularTools?: string;
      legal?: string;
      madeWith?: string;
      inPoland?: string;
    };
  };
}

// Popular tools for footer (based on search volume)
const FOOTER_POPULAR_TOOLS = [
  "password-generator",
  "countdown-vacation",
  "countdown-christmas",
  "bmi-calculator",
  "character-counter",
  "word-counter",
  "random-number",
  "countdown-date",
];

export function Footer({ locale, dictionary }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  const toolsCategory = getToolsByCategory("tools");
  const convertersCategory = getToolsByCategory("converters");
  const randomizersCategory = getToolsByCategory("randomizers");
  const calculatorsCategory = getToolsByCategory("calculators");
  
  const allTools = [...toolsCategory, ...convertersCategory, ...randomizersCategory, ...calculatorsCategory];
  const popularTools = FOOTER_POPULAR_TOOLS
    .map(id => allTools.find(t => t.id === id))
    .filter((t): t is Tool => t !== undefined);

  return (
    <footer className="border-t bg-muted/30" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 group" aria-label="uttlo - Strona główna">
              <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 shadow-lg shadow-indigo-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">
                {dictionary.brand}
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              {dictionary.footer.description || dictionary.tagline || "Darmowe narzędzia online dla każdego."}
            </p>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">
              {dictionary.footer.categories || "Kategorie"}
            </h3>
            <ul className="space-y-3" role="list">
              <li>
                <Link 
                  href={getCategoryUrl("tools", locale)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {dictionary.categories.tools}
                </Link>
              </li>
              <li>
                <Link 
                  href={getCategoryUrl("converters", locale)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {dictionary.categories.converters}
                </Link>
              </li>
              <li>
                <Link 
                  href={getCategoryUrl("randomizers", locale)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {dictionary.categories.randomizers}
                </Link>
              </li>
              <li>
                <Link 
                  href={getCategoryUrl("calculators", locale)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  {dictionary.categories.calculators}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tools Column 1 */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">
              {dictionary.footer.popularTools || "Popularne"}
            </h3>
            <ul className="space-y-3" role="list">
              {popularTools.slice(0, 4).map((tool) => {
                const toolDict = dictionary.tools[tool.id];
                return (
                  <li key={tool.id}>
                    <Link 
                      href={getToolUrl(tool, locale)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {toolDict?.name || tool.id}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Popular Tools Column 2 */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4 invisible">
              Więcej
            </h3>
            <ul className="space-y-3" role="list">
              {popularTools.slice(4, 8).map((tool) => {
                const toolDict = dictionary.tools[tool.id];
                return (
                  <li key={tool.id}>
                    <Link 
                      href={getToolUrl(tool, locale)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {toolDict?.name || tool.id}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground mb-4">
              {dictionary.footer.legal || "Informacje"}
            </h3>
            <ul className="space-y-3" role="list">
              <li>
                <Link 
                  href={`/${locale}/o-nas`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dictionary.footer.about || "O nas"}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/kontakt`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dictionary.footer.contact}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/polityka-prywatnosci`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dictionary.footer.privacy}
                </Link>
              </li>
              <li>
                <Link 
                  href={`/${locale}/regulamin`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dictionary.footer.terms || "Regulamin"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Tools Summary - SEO Links */}
        <div className="mt-12 pt-8 border-t">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Wszystkie narzędzia
          </h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {allTools.filter(t => t.isReady).slice(0, 20).map((tool) => {
              const toolDict = dictionary.tools[tool.id];
              return (
                <Link
                  key={tool.id}
                  href={getToolUrl(tool, locale)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {toolDict?.name || tool.id}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} {dictionary.brand}. {dictionary.footer.rights}.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            {dictionary.footer.madeWith || "Stworzone z"}
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            {dictionary.footer.inPoland || "w Polsce"}
          </p>
        </div>
      </div>
    </footer>
  );
}
