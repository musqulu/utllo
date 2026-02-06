import Link from "next/link";
import { JsonLd, generateBreadcrumbSchema } from "./json-ld";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
  className?: string;
}

export function Breadcrumbs({ items, baseUrl = "https://uttlo.com", className = "" }: BreadcrumbsProps) {
  const schemaItems = items.map((item) => ({
    name: item.name,
    url: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
  }));

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(schemaItems)} />
      <nav className={`text-sm text-muted-foreground ${className}`} aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 flex-wrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li key={item.url} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true">/</span>}
                {isLast ? (
                  <span className="text-foreground font-medium" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
