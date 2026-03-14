"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import {
  BUSINESS_TYPES,
  AU_STATES,
  INDUSTRIES,
  CATEGORY_LABELS,
  FREQUENCY_LABELS,
} from "@/lib/constants";
import { Loader2, Building2, MapPin, Sparkles, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import type { BusinessType, AUState, Industry } from "@/types/database";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Business", description: "Type & name" },
  { label: "Location", description: "State & industry" },
  { label: "Confirm", description: "Generate items" },
];

interface Recommendation {
  title: string;
  description: string;
  category: string;
  frequency: string;
  authority: string;
  whyRelevant: string;
}

export function OnboardingForm() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState<Set<number>>(new Set());

  // Step 1: Business type and name
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType | "">("");

  // Step 2: State and industry
  const [state, setState] = useState<AUState | "">("");
  const [industry, setIndustry] = useState<Industry | "">("");

  function canProceedStep1() {
    return businessName.trim().length >= 2 && businessType !== "";
  }

  function canProceedStep2() {
    return state !== "" && industry !== "";
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      // Insert profile first
      const { error: profileError } = await (supabase
        .from("profiles") as any)
        .upsert({
          id: session.user.id,
          business_name: businessName.trim(),
          business_type: businessType as BusinessType,
          state: state as AUState,
          industry: industry as Industry,
          onboarding_completed: false,
        });

      if (profileError) throw profileError;

      // Get AI recommendations
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          businessName: businessName.trim(),
          businessType,
          state,
          industry,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);

      // Select all recommendations by default
      setSelectedRecommendations(
        new Set(data.recommendations?.map((_: unknown, i: number) => i) || [])
      );

      // Generate compliance items from rules
      const { data: rules } = await (supabase as any)
        .from("compliance_rules")
        .select("*") as { data: Array<{
          business_types: string[];
          states: string[];
          industries: string[];
          default_due_date: string | null;
          title: string;
          description: string;
          frequency: string;
          category: string;
        }> | null };

      if (rules) {
        const matchingRules = rules.filter((rule) => {
          const matchesBusinessType =
            !rule.business_types?.length ||
            rule.business_types.includes(businessType);
          const matchesState =
            !rule.states?.length || rule.states.includes(state as AUState);
          const matchesIndustry =
            !rule.industries?.length ||
            rule.industries.includes(industry as Industry);
          return matchesBusinessType && matchesState && matchesIndustry;
        });

        const today = new Date();
        const items = matchingRules.map((rule) => {
          let dueDate = new Date(today);
          dueDate.setDate(dueDate.getDate() + 30);

          if (rule.default_due_date) {
            const monthMatch = rule.default_due_date.match(
              /(\d{1,2})\s*(?:st|nd|rd|th)?\s+(?:of\s+)?(?:month|following)/i
            );
            if (monthMatch) {
              const day = parseInt(monthMatch[1]);
              dueDate = new Date(today.getFullYear(), today.getMonth() + 1, day);
            } else if (rule.default_due_date.match(/31\s+october/i)) {
              dueDate = new Date(today.getFullYear(), 9, 31);
              if (dueDate < today) {
                dueDate = new Date(today.getFullYear() + 1, 9, 31);
              }
            } else if (rule.default_due_date.match(/28/i)) {
              const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 28);
              dueDate = nextMonth;
            }
          }

          return {
            user_id: session.user.id,
            title: rule.title,
            description: rule.description,
            due_date: dueDate.toISOString().split("T")[0],
            frequency: rule.frequency,
            category: rule.category,
            is_custom: false,
            completed: false,
          };
        });

        if (items.length > 0) {
          const { error: itemsError } = await (supabase as any)
            .from("compliance_items")
            .insert(items);

          if (itemsError) {
            console.error("Error inserting compliance items:", itemsError);
          }
        }
      }

      setStep(2);
      toast.success("Recommendations generated!", {
        description: `Found ${data.recommendations?.length || 0} personalised recommendations for your business.`,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to generate recommendations. You can add items manually later.";
      toast.error("Generation failed", { description: message });
    } finally {
      setGenerating(false);
    }
  }

  async function handleComplete() {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Not authenticated");
      }

      // Mark onboarding as complete
      const { error: updateError } = await (supabase as any)
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      // Add selected AI recommendations as compliance items
      const selectedRecs = recommendations.filter((_, i) =>
        selectedRecommendations.has(i)
      );

      if (selectedRecs.length > 0) {
        const items = selectedRecs.map((rec) => {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 30);

          return {
            user_id: session.user.id,
            title: rec.title,
            description: rec.description,
            due_date: dueDate.toISOString().split("T")[0],
            frequency: rec.frequency as "once" | "monthly" | "quarterly" | "annually",
            category: rec.category as "taxation" | "employment" | "safety" | "environmental" | "consumer" | "financial" | "licensing" | "privacy" | "other",
            is_custom: true,
            completed: false,
          };
        });

        await (supabase as any).from("compliance_items").insert(items);
      }

      toast.success("Setup complete!", {
        description: "Your compliance dashboard is ready. Let's get started!",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to complete setup.";
      toast.error("Setup failed", { description: message });
    } finally {
      setLoading(false);
    }
  }

  function toggleRecommendation(index: number) {
    setSelectedRecommendations((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <StepIndicator steps={STEPS} currentStep={step} />

      {step === 0 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Tell us about your business</CardTitle>
            <CardDescription>
              We&apos;ll use this to personalise your compliance tracking experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business name</Label>
              <Input
                id="businessName"
                placeholder="e.g. Smith & Co Plumbing"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="h-11"
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <Label>Business structure</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {BUSINESS_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setBusinessType(type.value)}
                    className={cn(
                      "rounded-xl border-2 p-4 text-left transition-all hover:border-primary/50",
                      businessType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 bg-white"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{type.label}</span>
                      {businessType === type.value && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setStep(1)}
                disabled={!canProceedStep1()}
                size="lg"
                className="gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Location & industry</CardTitle>
            <CardDescription>
              This helps us identify the specific regulations that apply to you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>State or territory</Label>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {AU_STATES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setState(s.value)}
                    className={cn(
                      "rounded-lg border-2 p-3 text-center text-sm font-medium transition-all hover:border-primary/50",
                      state === s.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 bg-white text-foreground"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Industry</Label>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.value}
                    type="button"
                    onClick={() => setIndustry(ind.value)}
                    className={cn(
                      "rounded-lg border-2 p-3 text-left text-sm font-medium transition-all hover:border-primary/50",
                      industry === ind.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 bg-white text-foreground"
                    )}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(0)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!canProceedStep2() || generating}
                size="lg"
                className="gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate recommendations
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <CardTitle className="text-xl">Your compliance profile</CardTitle>
            <CardDescription>
              We&apos;ve generated personalised recommendations for{" "}
              <span className="font-medium text-foreground">{businessName}</span>.
              Select the items you&apos;d like to track.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {recommendations.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  AI Recommendations ({selectedRecommendations.size} selected)
                </Label>
                {recommendations.map((rec, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleRecommendation(index)}
                    className={cn(
                      "w-full rounded-xl border-2 p-4 text-left transition-all",
                      selectedRecommendations.has(index)
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 bg-white opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {rec.title}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                            {CATEGORY_LABELS[rec.category as keyof typeof CATEGORY_LABELS] || rec.category}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {rec.description}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{FREQUENCY_LABELS[rec.frequency as keyof typeof FREQUENCY_LABELS] || rec.frequency}</span>
                          <span>•</span>
                          <span>{rec.authority}</span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                          selectedRecommendations.has(index)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-slate-300"
                        )}
                      >
                        {selectedRecommendations.has(index) && (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {recommendations.length === 0 && (
              <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                <Sparkles className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No additional AI recommendations were generated. Your compliance
                  items have been set up from our standard rules.
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={loading}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={loading}
                size="lg"
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete setup
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
