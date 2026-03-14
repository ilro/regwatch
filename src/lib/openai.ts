import OpenAI from "openai";
import type { BusinessType, AUState, Industry, Category } from "@/types/database";
import { CATEGORY_LABELS, BUSINESS_TYPE_LABELS, STATE_LABELS, INDUSTRY_LABELS } from "./constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface RecommendationResult {
  title: string;
  description: string;
  category: Category;
  frequency: "once" | "monthly" | "quarterly" | "annually";
  authority: string;
  whyRelevant: string;
}

export async function getComplianceRecommendations(params: {
  businessName: string;
  businessType: BusinessType;
  state: AUState;
  industry: Industry;
  existingItems: string[];
}): Promise<RecommendationResult[]> {
  const { businessName, businessType, state, industry, existingItems } = params;

  const systemPrompt = `You are an expert in Australian business compliance and regulation. You help small businesses understand their regulatory obligations.

Given a business profile, recommend additional compliance obligations the business might need to consider beyond what they already have.

Return your response as a JSON array with this exact structure:
[
  {
    "title": "Compliance obligation name",
    "description": "Detailed description of what this involves",
    "category": "one of: taxation, employment, safety, environmental, consumer, financial, licensing, privacy, other",
    "frequency": "one of: once, monthly, quarterly, annually",
    "authority": "Government body or regulator responsible",
    "whyRelevant": "Why this specifically applies to this type of business"
  }
]

Important guidelines:
- Focus on AUSTRALIAN federal, state, and local regulations
- Consider the specific state (${STATE_LABELS[state]})
- Consider the business type (${BUSINESS_TYPE_LABELS[businessType]})
- Consider the industry (${INDUSTRY_LABELS[industry]})
- Recommend 3-5 obligations maximum
- Return ONLY valid JSON, no markdown or extra text`;

  const userPrompt = `Business: "${businessName}" (${BUSINESS_TYPE_LABELS[businessType]}) in ${STATE_LABELS[state]}, ${INDUSTRY_LABELS[industry]} industry.

Existing compliance items they already track:
${existingItems.length > 0 ? existingItems.map((t) => `- ${t}`).join("\n") : "None yet - this is a new business."}

What compliance obligations might they be missing? Please provide 3-5 personalised recommendations.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  // Parse JSON from the response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Could not parse recommendations from AI response");
  }

  return JSON.parse(jsonMatch[0]) as RecommendationResult[];
}
