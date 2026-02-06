"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, ChevronDown, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getToolsByCategory, getToolUrl, categoryMeta, getCategoryUrl, Tool } from "@/lib/tools";

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

// Define popular tools for quick access (high-volume keywords)
const POPULAR_TOOL_IDS = [
  "password-generator",
  "countdown-vacation",
  "countdown-christmas",
  "bmi-calculator",
  "character-counter",
  "random-number",
];

export function Navbar({ locale, dictionary }: NavbarProps) {
  const pathname = usePathname();
  const toolsCategory = getToolsByCategory("tools");
  const convertersCategory = getToolsByCategory("converters");
  const randomizersCategory = getToolsByCategory("randomizers");
  const calculatorsCategory = getToolsByCategory("calculators");

  // Get all tools for finding popular ones
  const allTools = [...toolsCategory, ...convertersCategory, ...randomizersCategory, ...calculatorsCategory];
  const popularTools = POPULAR_TOOL_IDS
    .map(id => allTools.find(t => t.id === id))
    .filter((t): t is Tool => t !== undefined);

  const renderToolList = (tools: Tool[], showDescription = false) => {
    return tools.map((tool) => {
      const Icon = tool.icon;
      const toolDict = dictionary.tools[tool.id];
      return (
        <DropdownMenuItem key={tool.id} asChild>
          <Link
            href={getToolUrl(tool, locale)}
            className="flex items-center gap-3 cursor-pointer py-2"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{toolDict?.name || tool.id}</span>
              {showDescription && toolDict?.description && (
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {toolDict.description}
                </span>
              )}
            </div>
          </Link>
        </DropdownMenuItem>
      );
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 flex h-16 items-center justify-between" aria-label="Main navigation">
        {/* Logo */}
        <Link 
          href={`/${locale}`} 
          className="flex items-center gap-2 group"
          aria-label="uttlo - Strona główna"
        >
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              {dictionary.brand}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href={`/${locale}`}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              pathname === `/${locale}` 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {dictionary.nav.home}
          </Link>

          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1 px-4">
                {dictionary.nav.tools}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-80">
              {/* Popular Tools */}
              <DropdownMenuLabel className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                {dictionary.nav.popular || "Popularne"}
              </DropdownMenuLabel>
              {renderToolList(popularTools.slice(0, 4))}
              
              <DropdownMenuSeparator />

              {/* Category Links */}
              <div className="grid grid-cols-2 gap-1 p-2">
                <Link
                  href={getCategoryUrl("tools", locale)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  {dictionary.categories.tools}
                </Link>
                <Link
                  href={getCategoryUrl("converters", locale)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  {dictionary.categories.converters}
                </Link>
                <Link
                  href={getCategoryUrl("randomizers", locale)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  {dictionary.categories.randomizers}
                </Link>
                <Link
                  href={getCategoryUrl("calculators", locale)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  {dictionary.categories.calculators}
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Direct Category Links */}
          {[
            { key: "tools" as const, color: "blue" },
            { key: "calculators" as const, color: "purple" },
          ].map(({ key, color }) => (
            <Link
              key={key}
              href={getCategoryUrl(key, locale)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname.includes(`/${categoryMeta[key].slug}`)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {dictionary.categories[key]}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Otwórz menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 p-2">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white">
                  {dictionary.brand}
                </span>
              </SheetTitle>
            </SheetHeader>
            
            <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile navigation">
              <Link
                href={`/${locale}`}
                className={`flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  pathname === `/${locale}` ? "bg-primary/10 text-primary" : "hover:bg-accent"
                }`}
              >
                {dictionary.nav.home}
              </Link>

              {/* Popular Tools */}
              <div className="mt-4 mb-2 px-3">
                <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 text-yellow-500" />
                  {dictionary.nav.popular || "Popularne"}
                </span>
              </div>
              {popularTools.slice(0, 4).map((tool) => {
                const Icon = tool.icon;
                const toolDict = dictionary.tools[tool.id];
                const toolUrl = getToolUrl(tool, locale);
                const isActive = pathname === toolUrl;
                return (
                  <Link
                    key={tool.id}
                    href={toolUrl}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{toolDict?.name || tool.id}</span>
                  </Link>
                );
              })}

              {/* Categories */}
              {([
                { key: "tools" as const, tools: toolsCategory, color: "blue" },
                { key: "converters" as const, tools: convertersCategory, color: "green" },
                { key: "randomizers" as const, tools: randomizersCategory, color: "orange" },
                { key: "calculators" as const, tools: calculatorsCategory, color: "purple" },
              ]).map(({ key, tools, color }) => (
                <div key={key}>
                  <div className="mt-4 mb-2 border-t pt-4" />
                  <Link
                    href={getCategoryUrl(key, locale)}
                    className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-primary transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full bg-${color}-500`} style={{ backgroundColor: color === "blue" ? "#3b82f6" : color === "green" ? "#22c55e" : color === "orange" ? "#f97316" : "#a855f7" }} />
                    {dictionary.categories[key]}
                  </Link>
                  {tools.slice(0, 5).map((tool) => {
                    const Icon = tool.icon;
                    const toolDict = dictionary.tools[tool.id];
                    const toolUrl = getToolUrl(tool, locale);
                    const isActive = pathname === toolUrl;
                    return (
                      <Link
                        key={tool.id}
                        href={toolUrl}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive ? "bg-primary/10 text-primary" : "hover:bg-accent"
                        }`}
                      >
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{toolDict?.name || tool.id}</span>
                      </Link>
                    );
                  })}
                  {tools.length > 5 && (
                    <Link
                      href={getCategoryUrl(key, locale)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      + {tools.length - 5} więcej...
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
