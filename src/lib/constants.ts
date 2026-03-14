import type {
  AUState,
  BusinessType,
  Category,
  Frequency,
  Industry,
} from "@/types/database";

export const AU_STATES: { value: AUState; label: string }[] = [
  { value: "NSW", label: "New South Wales" },
  { value: "VIC", label: "Victoria" },
  { value: "QLD", label: "Queensland" },
  { value: "SA", label: "South Australia" },
  { value: "WA", label: "Western Australia" },
  { value: "TAS", label: "Tasmania" },
  { value: "NT", label: "Northern Territory" },
  { value: "ACT", label: "Australian Capital Territory" },
];

export const BUSINESS_TYPES: { value: BusinessType; label: string; description: string }[] = [
  { value: "sole_trader", label: "Sole Trader", description: "Individual operating a business" },
  { value: "partnership", label: "Partnership", description: "Two or more people running a business together" },
  { value: "company", label: "Company", description: "Registered company (Pty Ltd)" },
  { value: "trust", label: "Trust", description: "Business operated through a trust structure" },
  { value: "cooperative", label: "Co-operative", description: "Member-owned organisation" },
];

export const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: "retail", label: "Retail" },
  { value: "hospitality", label: "Hospitality & Food Services" },
  { value: "construction", label: "Construction & Trades" },
  { value: "professional_services", label: "Professional Services" },
  { value: "healthcare", label: "Healthcare & Medical" },
  { value: "education", label: "Education & Training" },
  { value: "technology", label: "Technology & IT" },
  { value: "agriculture", label: "Agriculture & Farming" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "transport", label: "Transport & Logistics" },
  { value: "finance", label: "Finance & Insurance" },
  { value: "real_estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];

export const CATEGORIES: { value: Category; label: string; colour: string }[] = [
  { value: "taxation", label: "Taxation", colour: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { value: "employment", label: "Employment", colour: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "safety", label: "Safety & WHS", colour: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "environmental", label: "Environmental", colour: "bg-green-100 text-green-800 border-green-200" },
  { value: "consumer", label: "Consumer Protection", colour: "bg-purple-100 text-purple-800 border-purple-200" },
  { value: "financial", label: "Financial", colour: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "licensing", label: "Licensing & Permits", colour: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  { value: "privacy", label: "Privacy & Data", colour: "bg-pink-100 text-pink-800 border-pink-200" },
  { value: "other", label: "Other", colour: "bg-slate-100 text-slate-800 border-slate-200" },
];

export const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: "once", label: "One-off" },
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
];

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
);

export const CATEGORY_COLOURS = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.colour])
);

export const FREQUENCY_LABELS = Object.fromEntries(
  FREQUENCIES.map((f) => [f.value, f.label])
);

export const BUSINESS_TYPE_LABELS = Object.fromEntries(
  BUSINESS_TYPES.map((b) => [b.value, b.label])
);

export const STATE_LABELS = Object.fromEntries(
  AU_STATES.map((s) => [s.value, s.label])
);

export const INDUSTRY_LABELS = Object.fromEntries(
  INDUSTRIES.map((i) => [i.value, i.label])
);
