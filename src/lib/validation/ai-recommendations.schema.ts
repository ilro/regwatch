import { z } from "zod";
import type { BusinessType, AUState, Industry } from "@/types/database";

export const aiRecommendationsRequestSchema = z.object({
  businessType: z.enum(["sole_trader", "partnership", "company", "trust", "cooperative"] as const),
  state: z.enum(["NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT", "ACT"] as const),
  industry: z.enum(["retail", "hospitality", "construction", "professional_services", "healthcare", "education", "technology", "agriculture", "manufacturing", "transport", "finance", "real_estate", "other"] as const),
  existingItems: z.array(z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
    due_date: z.string(),
    frequency: z.enum(["once", "weekly", "fortnightly", "monthly", "quarterly", "annually"] as const),
    category: z.enum(["taxation", "employment", "safety", "environmental", "consumer", "financial", "licensing", "privacy", "other"] as const),
    is_custom: z.boolean().optional(),
    completed: z.boolean().optional()
  })).optional()
});

export type AiRecommendationsRequest = z.infer<typeof aiRecommendationsRequestSchema>;
