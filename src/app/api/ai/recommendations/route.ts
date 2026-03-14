import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { aiRecommendationsRequestSchema } from "@/lib/validation/ai-recommendations.schema";
import { z } from "zod";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (now > record.resetTime) {
    // Reset the window
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  // Increment count
  record.count++;
  rateLimitMap.set(ip, record);
  return true;
}

const SYSTEM_PROMPT = `You are an expert in Australian business compliance regulations. 
Given a business profile and existing compliance items, recommend additional regulatory deadlines and compliance requirements the business may have missed.

Respond with a JSON object: { "recommendations": [{ "title": string, "description": string, "category": "taxation"|"employment"|"safety"|"environmental"|"consumer"|"financial"|"licensing"|"privacy"|"corporate"|"other", "frequency": "once"|"monthly"|"quarterly"|"annually" }] }

Consider:
- ATO requirements (BAS, PAYG, super guarantee, FBT, income tax)
- ASIC obligations (annual reviews, director duties)
- State-specific licensing (varies by state)
- WHS requirements (work health safety)
- Fair Work obligations (modern awards, leave, termination)
- Privacy Act (APPs, data breach notification)
- Industry-specific regulations
- Workers compensation insurance
- Payroll tax (state thresholds vary)
- Council permits and approvals`;

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    
    // Input validation
    const validationResult = aiRecommendationsRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { businessType, state, industry, existingItems } = validationResult.data;

    const existingTitles = (existingItems ?? []).map((i: { title: string }) => i.title).join(", ");

    const userMessage = `Business type: ${businessType}
State/Territory: ${state}
Industry: ${industry}
Existing compliance items: ${existingTitles || "None yet"}

What additional compliance requirements and regulatory deadlines should this business be aware of?`;

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI recommendations error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
