"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Zap, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  getToolsByCategory,
  getToolUrl,
  categoryMeta,
  getCategoryUrl,
  Tool,
  ToolCategory,
} from "@/lib/tools";

interface NavbarProps {
  locale: string;
  dictionary: {
    brand: string;
    tagline?: string;
    nav: {
      tools: string;
      home: string;
      allTools?: string;
      popular?: string;
    };
    categories: {
      tools: string;
      converters: string;
      randomizers: string;
      calculators: string;
    };
    tools: Record<string, { name: string; description: string }>;
  };
}

const CATEGORY_COLORS: Record<ToolCategory, string> = {
  tools: "bg-blue-500",
  converters: "bg-green-500",
  randomizers: "bg-orange-500",
  calculators: "bg-purple-500",
};

export function Navbar({ locale, dictionary }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openCategory, setOpenCategory] = useState<ToolCategory | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories: { key: ToolCategory; tools: Tool[] }[] = [
    { key: "tools", tools: getToolsByCategory("tools") },
    { key: "converters", tools: getToolsByCategory("converters") },
    { key: "randomizers", tools: getToolsByCategory("randomizers") },
    { key: "calculators", tools: getToolsByCategory("calculators") },
  ];

  const handleMouseEnter = useCallback((key: ToolCategory) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenCategory(key);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpenCategory(null);
    }, 150);
  }, []);

  // Close popover + mobile sheet on route change
  useEffect(() => {
    setOpenCategory(null);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        className="container mx-auto px-4 flex h-16 items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 group flex-shrink-0"
          aria-label="uttlo - Strona główna"
        >
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white hidden sm:block">
            {dictionary.brand}
          </span>
        </Link>

        {/* Desktop Navigation - Categories centered */}
        <div className="hidden lg:flex items-center gap-1">
          {categories.map(({ key, tools }) => {
            const isActive =
              openCategory === key ||
              pathname.includes(`/${categoryMeta[key].slug}`);

            return (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() =>
                    setOpenCategory(openCategory === key ? null : key)
                  }
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{dictionary.categories[key]}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openCategory === key ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Popover panel - rendered inside this wrapper so mouse hover covers both */}
                {openCategory === key && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                    <PopoverPanel
                      category={key}
                      tools={tools}
                      locale={locale}
                      dictionary={dictionary}
                      onNavigate={(href: string) => {
                        setOpenCategory(null);
                        router.push(href);
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right side - empty for balance, or future use */}
        <div className="hidden lg:block w-[120px]" />

        {/* Mobile Navigation */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Otwórz menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto p-0">
            <SheetHeader className="p-6 pb-4 border-b">
              <SheetTitle className="flex items-center gap-2.5">
                <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-2">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white">
                  {dictionary.brand}
                </span>
              </SheetTitle>
            </SheetHeader>

            <nav className="p-4" aria-label="Mobile navigation">
              <Link
                href={`/${locale}`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                  pathname === `/${locale}`
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent"
                }`}
              >
                {dictionary.nav.home}
              </Link>

              {categories.map(({ key, tools }) => (
                <MobileCategory
                  key={key}
                  categoryKey={key}
                  tools={tools}
                  locale={locale}
                  dictionary={dictionary}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

/* ---------- Desktop Popover Panel ---------- */

interface PopoverPanelProps {
  category: ToolCategory;
  tools: Tool[];
  locale: string;
  dictionary: NavbarProps["dictionary"];
  onNavigate: (href: string) => void;
}

function PopoverPanel({
  category,
  tools,
  locale,
  dictionary,
  onNavigate,
}: PopoverPanelProps) {
  const readyTools = tools.filter((t) => t.isReady);
  const comingSoonTools = tools.filter((t) => !t.isReady);

  return (
    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="rounded-2xl border bg-background shadow-xl shadow-black/5 dark:shadow-none p-2 w-[420px]">
        {/* Category header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <button
            onClick={() => onNavigate(getCategoryUrl(category, locale))}
            className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            <div
              className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[category]}`}
            />
            {dictionary.categories[category]}
          </button>
          <button
            onClick={() => onNavigate(getCategoryUrl(category, locale))}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Zobacz wszystkie
          </button>
        </div>

        {/* Tool list */}
        <div className="grid gap-0.5">
          {readyTools.map((tool) => {
            const Icon = tool.icon;
            const toolDict = dictionary.tools[tool.id];
            return (
              <button
                key={tool.id}
                onClick={() => onNavigate(getToolUrl(tool, locale))}
                className="group relative flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition-colors text-left w-full"
              >
                <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {toolDict?.name || tool.id}
                  </p>
                  {toolDict?.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {toolDict.description}
                    </p>
                  )}
                </div>
              </button>
            );
          })}

          {comingSoonTools.length > 0 && (
            <>
              <div className="mx-4 my-1 border-t" />
              {comingSoonTools.map((tool) => {
                const Icon = tool.icon;
                const toolDict = dictionary.tools[tool.id];
                return (
                  <button
                    key={tool.id}
                    onClick={() => onNavigate(getToolUrl(tool, locale))}
                    className="group relative flex items-start gap-3 rounded-xl p-3 hover:bg-accent transition-colors opacity-60 text-left w-full"
                  >
                    <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-muted-foreground">
                        {toolDict?.name || tool.id}
                      </p>
                      {toolDict?.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                          {toolDict.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile Collapsible Category ---------- */

interface MobileCategoryProps {
  categoryKey: ToolCategory;
  tools: Tool[];
  locale: string;
  dictionary: NavbarProps["dictionary"];
  pathname: string;
  onNavigate: () => void;
}

function MobileCategory({
  categoryKey,
  tools,
  locale,
  dictionary,
  pathname,
  onNavigate,
}: MobileCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold rounded-lg hover:bg-accent transition-colors"
      >
        <span className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[categoryKey]}`}
          />
          {dictionary.categories[categoryKey]}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-1 ml-2 space-y-0.5 animate-in slide-in-from-top-1 duration-150">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const toolDict = dictionary.tools[tool.id];
            const toolUrl = getToolUrl(tool, locale);
            const isActive = pathname === toolUrl;

            return (
              <Link
                key={tool.id}
                href={toolUrl}
                onClick={onNavigate}
                className={`flex items-start gap-3 rounded-lg px-4 py-2.5 transition-colors ${
                  isActive
                    ? "bg-primary/10"
                    : "hover:bg-accent"
                } ${!tool.isReady ? "opacity-50" : ""}`}
              >
                <div className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isActive ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {toolDict?.name || tool.id}
                  </p>
                  {toolDict?.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {toolDict.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}

          <Link
            href={getCategoryUrl(categoryKey, locale)}
            onClick={onNavigate}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Zobacz wszystkie {dictionary.categories[categoryKey].toLowerCase()}
          </Link>
        </div>
      )}
    </div>
  );
}
