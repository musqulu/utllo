"use client";

import { StrengthResult } from "@/lib/password";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  strength: StrengthResult;
}

export function PasswordStrength({ strength }: PasswordStrengthProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Siła hasła:</span>
        <span className="font-medium">{strength.label}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={cn("h-full transition-all duration-300", strength.color)}
          style={{ width: `${strength.score}%` }}
        />
      </div>
    </div>
  );
}
