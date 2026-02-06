import { LucideIcon, Construction, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface ToolPlaceholderProps {
  icon?: LucideIcon;
  name: string;
  description?: string;
  comingSoonLabel?: string;
  placeholderMessage?: string;
}

export function ToolPlaceholder({
  icon: Icon = Wrench,
  name,
  description = "To narzędzie jest w przygotowaniu.",
  comingSoonLabel = "Wkrótce",
  placeholderMessage = "Pracujemy nad tym narzędziem. Zapraszamy wkrótce!",
}: ToolPlaceholderProps) {
  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="rounded-full bg-muted p-4">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
            <Construction className="h-4 w-4" />
            <span>{comingSoonLabel}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {placeholderMessage}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
