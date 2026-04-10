"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Globe, Plus, Trash2, ArrowRightLeft, Clock, Save } from "lucide-react";
import { trackToolEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorldTimeDictionary {
  title: string;
  subtitle: string;
  dashboardTitle: string;
  dashboardHint: string;
  localLabel: string;
  addCityTitle: string;
  cityName: string;
  cityNamePlaceholder: string;
  timeZone: string;
  addCity: string;
  conversionTitle: string;
  fromCity: string;
  toCity: string;
  baseTime: string;
  convert: string;
  convertedTime: string;
  dayShift: string;
  sameDay: string;
  nextDay: string;
  previousDay: string;
  savePreset: string;
  presets: string;
  noPresets: string;
  remove: string;
  noCities: string;
  customTag: string;
  cityPicker: string;
  cityPickerPlaceholder: string;
  autoTimeZone: string;
  switchToManual: string;
  switchToList: string;
  cityRequiredError: string;
  duplicateCityError: string;
}

interface WorldTimeDashboardProps {
  dictionary: WorldTimeDictionary;
}

interface CityEntry {
  id: string;
  label: string;
  timeZone: string;
  isCustom: boolean;
}

interface ConversionPreset {
  id: string;
  fromCityId: string;
  toCityId: string;
}

interface PersistedState {
  cities: CityEntry[];
  presets: ConversionPreset[];
}

interface CuratedCity {
  label: string;
  timeZone: string;
}

const STORAGE_KEY = "utllo-world-time-dashboard";
const COOKIE_KEY = "utllo_world_time_saved";
const COOKIE_TTL_SECONDS = 60 * 60 * 24 * 365;

const DEFAULT_CITIES: CityEntry[] = [
  { id: "honolulu", label: "Honolulu", timeZone: "Pacific/Honolulu", isCustom: false },
  { id: "los-angeles", label: "Los Angeles", timeZone: "America/Los_Angeles", isCustom: false },
  { id: "denver", label: "Denver", timeZone: "America/Denver", isCustom: false },
  { id: "chicago", label: "Chicago", timeZone: "America/Chicago", isCustom: false },
  { id: "new-york", label: "New York", timeZone: "America/New_York", isCustom: false },
  { id: "sao-paulo", label: "Sao Paulo", timeZone: "America/Sao_Paulo", isCustom: false },
  { id: "london", label: "London", timeZone: "Europe/London", isCustom: false },
  { id: "warsaw", label: "Warsaw", timeZone: "Europe/Warsaw", isCustom: false },
  { id: "dubai", label: "Dubai", timeZone: "Asia/Dubai", isCustom: false },
  { id: "delhi", label: "Delhi", timeZone: "Asia/Kolkata", isCustom: false },
  { id: "bangkok", label: "Bangkok", timeZone: "Asia/Bangkok", isCustom: false },
  { id: "tokyo", label: "Tokyo", timeZone: "Asia/Tokyo", isCustom: false },
  { id: "sydney", label: "Sydney", timeZone: "Australia/Sydney", isCustom: false },
  { id: "auckland", label: "Auckland", timeZone: "Pacific/Auckland", isCustom: false },
];

const CURATED_CITIES: CuratedCity[] = [
  { label: "Amsterdam", timeZone: "Europe/Amsterdam" },
  { label: "Athens", timeZone: "Europe/Athens" },
  { label: "Auckland", timeZone: "Pacific/Auckland" },
  { label: "Bangkok", timeZone: "Asia/Bangkok" },
  { label: "Barcelona", timeZone: "Europe/Madrid" },
  { label: "Beijing", timeZone: "Asia/Shanghai" },
  { label: "Belgrade", timeZone: "Europe/Belgrade" },
  { label: "Berlin", timeZone: "Europe/Berlin" },
  { label: "Bogota", timeZone: "America/Bogota" },
  { label: "Boston", timeZone: "America/New_York" },
  { label: "Bratislava", timeZone: "Europe/Bratislava" },
  { label: "Brisbane", timeZone: "Australia/Brisbane" },
  { label: "Brussels", timeZone: "Europe/Brussels" },
  { label: "Bucharest", timeZone: "Europe/Bucharest" },
  { label: "Budapest", timeZone: "Europe/Budapest" },
  { label: "Buenos Aires", timeZone: "America/Argentina/Buenos_Aires" },
  { label: "Cairo", timeZone: "Africa/Cairo" },
  { label: "Calgary", timeZone: "America/Edmonton" },
  { label: "Cape Town", timeZone: "Africa/Johannesburg" },
  { label: "Caracas", timeZone: "America/Caracas" },
  { label: "Casablanca", timeZone: "Africa/Casablanca" },
  { label: "Chicago", timeZone: "America/Chicago" },
  { label: "Copenhagen", timeZone: "Europe/Copenhagen" },
  { label: "Delhi", timeZone: "Asia/Kolkata" },
  { label: "Denver", timeZone: "America/Denver" },
  { label: "Detroit", timeZone: "America/Detroit" },
  { label: "Doha", timeZone: "Asia/Qatar" },
  { label: "Dubai", timeZone: "Asia/Dubai" },
  { label: "Dublin", timeZone: "Europe/Dublin" },
  { label: "Edinburgh", timeZone: "Europe/London" },
  { label: "Frankfurt", timeZone: "Europe/Berlin" },
  { label: "Geneva", timeZone: "Europe/Zurich" },
  { label: "Hamburg", timeZone: "Europe/Berlin" },
  { label: "Hanoi", timeZone: "Asia/Bangkok" },
  { label: "Helsinki", timeZone: "Europe/Helsinki" },
  { label: "Hong Kong", timeZone: "Asia/Hong_Kong" },
  { label: "Honolulu", timeZone: "Pacific/Honolulu" },
  { label: "Houston", timeZone: "America/Chicago" },
  { label: "Istanbul", timeZone: "Europe/Istanbul" },
  { label: "Jakarta", timeZone: "Asia/Jakarta" },
  { label: "Johannesburg", timeZone: "Africa/Johannesburg" },
  { label: "Kiev", timeZone: "Europe/Kyiv" },
  { label: "Krakow", timeZone: "Europe/Warsaw" },
  { label: "Kuala Lumpur", timeZone: "Asia/Kuala_Lumpur" },
  { label: "Kyoto", timeZone: "Asia/Tokyo" },
  { label: "Lagos", timeZone: "Africa/Lagos" },
  { label: "Las Vegas", timeZone: "America/Los_Angeles" },
  { label: "Lisbon", timeZone: "Europe/Lisbon" },
  { label: "Ljubljana", timeZone: "Europe/Ljubljana" },
  { label: "London", timeZone: "Europe/London" },
  { label: "Los Angeles", timeZone: "America/Los_Angeles" },
  { label: "Lyon", timeZone: "Europe/Paris" },
  { label: "Madrid", timeZone: "Europe/Madrid" },
  { label: "Manila", timeZone: "Asia/Manila" },
  { label: "Melbourne", timeZone: "Australia/Melbourne" },
  { label: "Mexico City", timeZone: "America/Mexico_City" },
  { label: "Miami", timeZone: "America/New_York" },
  { label: "Milan", timeZone: "Europe/Rome" },
  { label: "Montreal", timeZone: "America/Toronto" },
  { label: "Moscow", timeZone: "Europe/Moscow" },
  { label: "Mumbai", timeZone: "Asia/Kolkata" },
  { label: "Munich", timeZone: "Europe/Berlin" },
  { label: "Nairobi", timeZone: "Africa/Nairobi" },
  { label: "New York", timeZone: "America/New_York" },
  { label: "Nice", timeZone: "Europe/Paris" },
  { label: "Osaka", timeZone: "Asia/Tokyo" },
  { label: "Oslo", timeZone: "Europe/Oslo" },
  { label: "Ottawa", timeZone: "America/Toronto" },
  { label: "Paris", timeZone: "Europe/Paris" },
  { label: "Perth", timeZone: "Australia/Perth" },
  { label: "Philadelphia", timeZone: "America/New_York" },
  { label: "Prague", timeZone: "Europe/Prague" },
  { label: "Reykjavik", timeZone: "Atlantic/Reykjavik" },
  { label: "Riga", timeZone: "Europe/Riga" },
  { label: "Rio de Janeiro", timeZone: "America/Sao_Paulo" },
  { label: "Rome", timeZone: "Europe/Rome" },
  { label: "San Francisco", timeZone: "America/Los_Angeles" },
  { label: "Santiago", timeZone: "America/Santiago" },
  { label: "Sao Paulo", timeZone: "America/Sao_Paulo" },
  { label: "Seattle", timeZone: "America/Los_Angeles" },
  { label: "Seoul", timeZone: "Asia/Seoul" },
  { label: "Shanghai", timeZone: "Asia/Shanghai" },
  { label: "Singapore", timeZone: "Asia/Singapore" },
  { label: "Sofia", timeZone: "Europe/Sofia" },
  { label: "Stockholm", timeZone: "Europe/Stockholm" },
  { label: "Sydney", timeZone: "Australia/Sydney" },
  { label: "Taipei", timeZone: "Asia/Taipei" },
  { label: "Tallinn", timeZone: "Europe/Tallinn" },
  { label: "Tel Aviv", timeZone: "Asia/Jerusalem" },
  { label: "Tokyo", timeZone: "Asia/Tokyo" },
  { label: "Toronto", timeZone: "America/Toronto" },
  { label: "Valencia", timeZone: "Europe/Madrid" },
  { label: "Vancouver", timeZone: "America/Vancouver" },
  { label: "Venice", timeZone: "Europe/Rome" },
  { label: "Vienna", timeZone: "Europe/Vienna" },
  { label: "Vilnius", timeZone: "Europe/Vilnius" },
  { label: "Warsaw", timeZone: "Europe/Warsaw" },
  { label: "Washington", timeZone: "America/New_York" },
  { label: "Wellington", timeZone: "Pacific/Auckland" },
  { label: "Zurich", timeZone: "Europe/Zurich" },
];

function getSupportedTimeZones(): string[] {
  if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch {
      return DEFAULT_CITIES.map((city) => city.timeZone);
    }
  }
  return DEFAULT_CITIES.map((city) => city.timeZone);
}

function formatTimeForZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatDateForZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(date);
}

function getOffsetMs(date: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const values: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      values[part.type] = Number.parseInt(part.value, 10);
    }
  }

  const asUtc = Date.UTC(
    values.year,
    (values.month || 1) - 1,
    values.day || 1,
    values.hour || 0,
    values.minute || 0,
    values.second || 0
  );

  return asUtc - date.getTime();
}

function parseDateTimeInput(value: string): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
} | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return null;
  return {
    year: Number.parseInt(match[1], 10),
    month: Number.parseInt(match[2], 10),
    day: Number.parseInt(match[3], 10),
    hour: Number.parseInt(match[4], 10),
    minute: Number.parseInt(match[5], 10),
  };
}

function zonedDateTimeToUtcMs(input: string, timeZone: string): number | null {
  const parsed = parseDateTimeInput(input);
  if (!parsed) return null;

  let utcMs = Date.UTC(parsed.year, parsed.month - 1, parsed.day, parsed.hour, parsed.minute, 0);
  for (let i = 0; i < 3; i += 1) {
    const offset = getOffsetMs(new Date(utcMs), timeZone);
    utcMs = Date.UTC(parsed.year, parsed.month - 1, parsed.day, parsed.hour, parsed.minute, 0) - offset;
  }

  return utcMs;
}

function getDayShift(baseUtcMs: number, fromZone: string, toZone: string): number {
  const toDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: toZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(baseUtcMs));

  const fromDay = new Intl.DateTimeFormat("en-CA", {
    timeZone: fromZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(baseUtcMs));

  const toDate = new Date(`${toDay}T00:00:00Z`);
  const fromDate = new Date(`${fromDay}T00:00:00Z`);
  return Math.round((toDate.getTime() - fromDate.getTime()) / (24 * 60 * 60 * 1000));
}

function getNowInputValue(): string {
  const now = new Date();
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function WorldTimeDashboard({ dictionary }: WorldTimeDashboardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [now, setNow] = useState<Date>(new Date(0));
  const [cities, setCities] = useState<CityEntry[]>(DEFAULT_CITIES);
  const [presets, setPresets] = useState<ConversionPreset[]>([]);
  const [newCityName, setNewCityName] = useState("");
  const [newTimeZone, setNewTimeZone] = useState("Europe/Warsaw");
  const [selectedCatalogCity, setSelectedCatalogCity] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [addError, setAddError] = useState("");
  const [fromCityId, setFromCityId] = useState(DEFAULT_CITIES[7].id);
  const [toCityId, setToCityId] = useState(DEFAULT_CITIES[11].id);
  const [baseDateTime, setBaseDateTime] = useState("");
  const [convertedResult, setConvertedResult] = useState<string>("");
  const [dayShift, setDayShift] = useState(0);

  const availableTimeZones = useMemo(() => getSupportedTimeZones(), []);
  const curatedCityMap = useMemo(() => {
    return new Map(CURATED_CITIES.map((city) => [city.label.toLowerCase(), city]));
  }, []);

  const cityMap = useMemo(() => {
    return new Map(cities.map((city) => [city.id, city]));
  }, [cities]);

  const fromCity = cityMap.get(fromCityId);
  const toCity = cityMap.get(toCityId);

  useEffect(() => {
    setIsMounted(true);
    setNow(new Date());
    setBaseDateTime(getNowInputValue());
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistedState;
      if (Array.isArray(parsed.cities) && parsed.cities.length > 0) {
        setCities(parsed.cities);
      }
      if (Array.isArray(parsed.presets)) {
        setPresets(parsed.presets);
      }
    } catch {
      // ignore invalid storage state
    }
  }, []);

  useEffect(() => {
    try {
      const state: PersistedState = { cities, presets };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      document.cookie = `${COOKIE_KEY}=1; path=/; max-age=${COOKIE_TTL_SECONDS}; SameSite=Lax`;
    } catch {
      // localStorage/cookie might be unavailable
    }
  }, [cities, presets]);

  const applyConversion = useCallback(() => {
    if (!fromCity || !toCity) return;
    const utcMs = zonedDateTimeToUtcMs(baseDateTime, fromCity.timeZone);
    if (utcMs === null) return;
    const output = `${formatDateForZone(new Date(utcMs), toCity.timeZone)} ${formatTimeForZone(
      new Date(utcMs),
      toCity.timeZone
    )}`;
    setConvertedResult(output);
    setDayShift(getDayShift(utcMs, fromCity.timeZone, toCity.timeZone));
    trackToolEvent("world-time-dashboard", "tools", "use");
  }, [baseDateTime, fromCity, toCity]);

  useEffect(() => {
    if (isMounted && baseDateTime && fromCity && toCity) {
      applyConversion();
    }
  }, [applyConversion, baseDateTime, fromCity, isMounted, toCity]);

  const handleAddCity = useCallback(() => {
    const label = newCityName.trim();
    if (!label || !newTimeZone) {
      setAddError(dictionary.cityRequiredError);
      return;
    }
    const isDuplicate = cities.some(
      (city) => city.label.trim().toLowerCase() === label.toLowerCase() && city.timeZone === newTimeZone
    );
    if (isDuplicate) {
      setAddError(dictionary.duplicateCityError);
      return;
    }
    const id = `custom-${Date.now()}`;
    const nextCity: CityEntry = {
      id,
      label,
      timeZone: newTimeZone,
      isCustom: true,
    };
    setCities((prev) => [...prev, nextCity]);
    setAddError("");
    setNewCityName("");
    setSelectedCatalogCity("");
    setFromCityId(id);
    setToCityId(id);
    trackToolEvent("world-time-dashboard", "tools", "use");
  }, [cities, dictionary.cityRequiredError, dictionary.duplicateCityError, newCityName, newTimeZone]);

  const handleRemoveCity = useCallback(
    (cityId: string) => {
      setCities((prev) => {
        const next = prev.filter((city) => city.id !== cityId);
        if (next.length > 0) {
          if (fromCityId === cityId) setFromCityId(next[0].id);
          if (toCityId === cityId) setToCityId(next[Math.min(1, next.length - 1)].id);
        }
        return next;
      });
      setPresets((prev) => prev.filter((preset) => preset.fromCityId !== cityId && preset.toCityId !== cityId));
    },
    [fromCityId, toCityId]
  );

  const handleSavePreset = useCallback(() => {
    if (!fromCity || !toCity) return;
    const id = `${fromCity.id}-${toCity.id}`;
    setPresets((prev) => {
      if (prev.some((preset) => preset.id === id)) return prev;
      return [...prev, { id, fromCityId: fromCity.id, toCityId: toCity.id }];
    });
    trackToolEvent("world-time-dashboard", "tools", "use");
  }, [fromCity, toCity]);

  const dayShiftLabel =
    dayShift === 0 ? dictionary.sameDay : dayShift > 0 ? dictionary.nextDay : dictionary.previousDay;

  const handleCatalogCityChange = useCallback(
    (value: string) => {
      setSelectedCatalogCity(value);
      const matched = curatedCityMap.get(value.trim().toLowerCase());
      if (matched) {
        setNewCityName(matched.label);
        setNewTimeZone(matched.timeZone);
        setAddError("");
      }
    },
    [curatedCityMap]
  );

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Globe className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle>{dictionary.title}</CardTitle>
        <CardDescription>{dictionary.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{dictionary.dashboardTitle}</h3>
            <Badge variant="secondary">
              {dictionary.localLabel}: {isMounted ? now.toLocaleTimeString() : "--:--:--"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{dictionary.dashboardHint}</p>
          {cities.length === 0 ? (
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">{dictionary.noCities}</div>
          ) : (
            <div className="grid gap-2">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{city.label}</p>
                      {city.isCustom && <Badge variant="outline">{dictionary.customTag}</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{city.timeZone}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-mono text-lg">
                        {isMounted ? formatTimeForZone(now, city.timeZone) : "--:--:--"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isMounted ? formatDateForZone(now, city.timeZone) : "---"}
                      </p>
                    </div>
                    {city.isCustom && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCity(city.id)}
                        aria-label={`${dictionary.remove} ${city.label}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3 rounded-lg border p-4">
          <h3 className="text-lg font-semibold">{dictionary.addCityTitle}</h3>
          <div className="grid gap-3 md:grid-cols-3">
            {!manualMode ? (
              <>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="world-time-city-picker">{dictionary.cityPicker}</Label>
                  <Input
                    id="world-time-city-picker"
                    list="world-time-city-list"
                    value={selectedCatalogCity}
                    onChange={(event) => handleCatalogCityChange(event.target.value)}
                    placeholder={dictionary.cityPickerPlaceholder}
                  />
                  <datalist id="world-time-city-list">
                    {CURATED_CITIES.map((city) => (
                      <option key={`${city.label}-${city.timeZone}`} value={city.label} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <Label>{dictionary.timeZone}</Label>
                  <Input value={newTimeZone} readOnly />
                  <p className="text-xs text-muted-foreground">{dictionary.autoTimeZone}</p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="world-time-city-name">{dictionary.cityName}</Label>
                  <Input
                    id="world-time-city-name"
                    value={newCityName}
                    onChange={(event) => setNewCityName(event.target.value)}
                    placeholder={dictionary.cityNamePlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{dictionary.timeZone}</Label>
                  <Select value={newTimeZone} onValueChange={setNewTimeZone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {availableTimeZones.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="flex items-end">
              <Button onClick={handleAddCity} className="w-full gap-2" disabled={!newCityName.trim()}>
                <Plus className="h-4 w-4" />
                {dictionary.addCity}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="link"
              className="h-auto p-0"
              onClick={() => {
                setManualMode((prev) => !prev);
                setAddError("");
              }}
            >
              {manualMode ? dictionary.switchToList : dictionary.switchToManual}
            </Button>
            {addError ? <p className="text-sm text-destructive">{addError}</p> : null}
          </div>
        </section>

        <section className="space-y-4 rounded-lg border p-4">
          <h3 className="text-lg font-semibold">{dictionary.conversionTitle}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{dictionary.fromCity}</Label>
              <Select value={fromCityId} onValueChange={setFromCityId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{dictionary.toCity}</Label>
              <Select value={toCityId} onValueChange={setToCityId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid min-w-0 gap-3 md:grid-cols-3">
            <div className="min-w-0 space-y-2 md:col-span-2">
              <Label htmlFor="world-time-base">{dictionary.baseTime}</Label>
              <Input
                id="world-time-base"
                type="datetime-local"
                value={baseDateTime}
                onChange={(event) => setBaseDateTime(event.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-end">
              <Button onClick={applyConversion} className="w-full gap-2 sm:flex-1">
                <ArrowRightLeft className="h-4 w-4" />
                {dictionary.convert}
              </Button>
              <Button variant="outline" onClick={handleSavePreset} className="w-full gap-2 sm:w-auto">
                <Save className="h-4 w-4" />
                {dictionary.savePreset}
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">{dictionary.convertedTime}</p>
            <p className="break-words font-mono text-lg sm:text-xl">{convertedResult}</p>
            <p className="text-xs text-muted-foreground">
              {dictionary.dayShift}: {dayShiftLabel}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium">{dictionary.presets}</p>
            </div>
            {presets.length === 0 ? (
              <p className="text-sm text-muted-foreground">{dictionary.noPresets}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => {
                  const presetFrom = cityMap.get(preset.fromCityId);
                  const presetTo = cityMap.get(preset.toCityId);
                  if (!presetFrom || !presetTo) return null;
                  return (
                    <Button
                      key={preset.id}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFromCityId(preset.fromCityId);
                        setToCityId(preset.toCityId);
                      }}
                    >
                      {presetFrom.label} to {presetTo.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
