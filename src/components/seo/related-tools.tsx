import Link from "next/link";
import { Tool, getRelatedTools, getToolUrl } from "@/lib/tools";

interface RelatedToolsProps {
  currentToolId: string;
  locale: string;
  dictionary: {
    tools: Record<string, { name?: string }>;
    relatedToolsTitle?: string;
  };
  limit?: number;
  className?: string;
}

export function RelatedTools({
  currentToolId,
  locale,
  dictionary,
  limit = 3,
  className = "",
}: RelatedToolsProps) {
  const relatedTools = getRelatedTools(currentToolId, limit);

  if (relatedTools.length === 0) return null;

  return (
    <section className={`mt-16 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-center">
        {dictionary.relatedToolsTitle || "Powiązane narzędzia"}
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {relatedTools.map((tool) => {
          const toolDict = dictionary.tools[tool.id];
          const Icon = tool.icon;
          
          return (
            <Link
              key={tool.id}
              href={getToolUrl(tool, locale)}
              className="p-4 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all text-center group"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit mx-auto mb-2 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">{toolDict?.name || tool.id}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

interface RelatedToolsFromCategoryProps {
  tools: Tool[];
  locale: string;
  dictionary: {
    tools: Record<string, { name?: string }>;
  };
  title?: string;
  className?: string;
}

export function RelatedToolsFromCategory({
  tools,
  locale,
  dictionary,
  title = "Powiązane narzędzia",
  className = "",
}: RelatedToolsFromCategoryProps) {
  if (tools.length === 0) return null;

  return (
    <section className={`mt-16 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {tools.map((tool) => {
          const toolDict = dictionary.tools[tool.id];
          const Icon = tool.icon;
          
          return (
            <Link
              key={tool.id}
              href={getToolUrl(tool, locale)}
              className="p-4 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all text-center group"
            >
              <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit mx-auto mb-2 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">{toolDict?.name || tool.id}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
