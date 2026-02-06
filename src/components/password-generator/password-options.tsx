"use client";

import { PasswordOptions as PasswordOptionsType } from "@/lib/password";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface PasswordOptionsProps {
  options: PasswordOptionsType;
  onOptionsChange: (options: PasswordOptionsType) => void;
}

export function PasswordOptions({ options, onOptionsChange }: PasswordOptionsProps) {
  const handleChange = (key: keyof PasswordOptionsType, value: boolean | number) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Length Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="length">Długość hasła</Label>
          <span className="text-sm font-medium">{options.length} znaków</span>
        </div>
        <Slider
          id="length"
          min={8}
          max={64}
          step={1}
          value={[options.length]}
          onValueChange={([value]) => handleChange("length", value)}
        />
      </div>

      {/* Character Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="uppercase" className="cursor-pointer">
            Wielkie litery (A-Z)
          </Label>
          <Switch
            id="uppercase"
            checked={options.uppercase}
            onCheckedChange={(checked) => handleChange("uppercase", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="lowercase" className="cursor-pointer">
            Małe litery (a-z)
          </Label>
          <Switch
            id="lowercase"
            checked={options.lowercase}
            onCheckedChange={(checked) => handleChange("lowercase", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="numbers" className="cursor-pointer">
            Cyfry (0-9)
          </Label>
          <Switch
            id="numbers"
            checked={options.numbers}
            onCheckedChange={(checked) => handleChange("numbers", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="symbols" className="cursor-pointer">
            Symbole (!@#$%^&*)
          </Label>
          <Switch
            id="symbols"
            checked={options.symbols}
            onCheckedChange={(checked) => handleChange("symbols", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="excludeSimilar" className="cursor-pointer">
            Wyklucz podobne (0, O, l, 1, I)
          </Label>
          <Switch
            id="excludeSimilar"
            checked={options.excludeSimilar}
            onCheckedChange={(checked) => handleChange("excludeSimilar", checked)}
          />
        </div>
      </div>
    </div>
  );
}
