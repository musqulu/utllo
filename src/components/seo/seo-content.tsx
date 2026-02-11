/**
 * Reusable renderer for structured SEO content blocks.
 * Reads an array of typed sections from the i18n dictionary
 * and renders them as semantic HTML for search engines.
 */

export interface SeoTextBlock {
  type: "text";
  heading: string;
  body: string;
}

export interface SeoListBlock {
  type: "list";
  heading: string;
  items: string[];
}

export interface SeoOrderedListBlock {
  type: "ordered-list";
  heading: string;
  items: string[];
}

export interface SeoFaqBlock {
  type: "faq";
  heading: string;
  items: { q: string; a: string }[];
}

export interface SeoGridBlock {
  type: "grid";
  heading: string;
  items: { title: string; body: string }[];
}

export interface SeoTableBlock {
  type: "table";
  heading: string;
  headers: string[];
  rows: string[][];
}

export type SeoBlock =
  | SeoTextBlock
  | SeoListBlock
  | SeoOrderedListBlock
  | SeoFaqBlock
  | SeoGridBlock
  | SeoTableBlock;

interface SeoContentProps {
  blocks: SeoBlock[];
  className?: string;
}

export function SeoContent({ blocks, className = "" }: SeoContentProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <section className={`mt-16 max-w-3xl mx-auto space-y-10 ${className}`}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return (
              <div key={i}>
                <h2 className="text-2xl font-bold mb-4">{block.heading}</h2>
                <p className="text-muted-foreground">{block.body}</p>
              </div>
            );

          case "list":
            return (
              <div key={i}>
                <h3 className="text-xl font-semibold mb-3">{block.heading}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {block.items.map((item, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              </div>
            );

          case "ordered-list":
            return (
              <div key={i}>
                <h3 className="text-xl font-semibold mb-3">{block.heading}</h3>
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                  {block.items.map((item, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ol>
              </div>
            );

          case "faq":
            return (
              <div key={i}>
                <h3 className="text-xl font-semibold mb-4">{block.heading}</h3>
                <div className="space-y-4">
                  {block.items.map((faq, j) => (
                    <div key={j} className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">{faq.q}</h4>
                      <p className="text-sm text-muted-foreground">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            );

          case "grid":
            return (
              <div key={i}>
                <h3 className="text-xl font-semibold mb-4">{block.heading}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {block.items.map((card, j) => (
                    <div key={j} className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">{card.title}</h4>
                      <p className="text-sm text-muted-foreground">{card.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            );

          case "table":
            return (
              <div key={i}>
                <h3 className="text-xl font-semibold mb-4">{block.heading}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {block.headers.map((h, j) => (
                          <th key={j} className="text-left p-3 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      {block.rows.map((row, j) => (
                        <tr key={j} className="border-b">
                          {row.map((cell, k) => (
                            <td key={k} className="p-3">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </section>
  );
}
