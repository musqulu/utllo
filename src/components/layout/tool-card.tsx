import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  href: string;
  icon: LucideIcon;
  name: string;
  description: string;
  isReady: boolean;
  comingSoonLabel: string;
}

export function ToolCard({
  href,
  icon: Icon,
  name,
  description,
  isReady,
  comingSoonLabel,
}: ToolCardProps) {
  const CardWrapper = isReady ? Link : "div";

  return (
    <CardWrapper
      href={isReady ? href : "#"}
      className={cn(
        "block group",
        !isReady && "cursor-not-allowed opacity-60"
      )}
    >
      <Card
        className={cn(
          "h-full transition-all duration-200",
          isReady && "hover:shadow-md hover:border-primary/50"
        )}
      >
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div
              className={cn(
                "rounded-full p-3 transition-colors",
                isReady
                  ? "bg-primary/10 group-hover:bg-primary/20"
                  : "bg-muted"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6",
                  isReady ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>
            {!isReady && (
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {comingSoonLabel}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  );
}
