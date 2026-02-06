"use client";

import { useState, useEffect, useCallback } from "react";
import { KeyRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordDisplay } from "./password-display";
import { PasswordStrength } from "./password-strength";
import { PasswordOptions } from "./password-options";
import {
  generatePassword,
  calculateStrength,
  DEFAULT_OPTIONS,
  PasswordOptions as PasswordOptionsType,
} from "@/lib/password";

export function GeneratorCard() {
  const [options, setOptions] = useState<PasswordOptionsType>(DEFAULT_OPTIONS);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(calculateStrength(""));

  const regeneratePassword = useCallback(() => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setStrength(calculateStrength(newPassword));
  }, [options]);

  // Generate initial password on mount and when options change
  useEffect(() => {
    regeneratePassword();
  }, [regeneratePassword]);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Generator Haseł</CardTitle>
        <CardDescription>
          Twórz silne i bezpieczne hasła jednym kliknięciem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PasswordDisplay password={password} onRegenerate={regeneratePassword} />
        <PasswordStrength strength={strength} />
        <div className="border-t pt-6">
          <PasswordOptions options={options} onOptionsChange={setOptions} />
        </div>
      </CardContent>
    </Card>
  );
}
