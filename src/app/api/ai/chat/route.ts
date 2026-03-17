import { NextRequest } from "next/server";
import OpenAI from "openai";
import { chatRequestSchema } from "@/lib/validation/ai-chat.schema";

function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// In-memory rate limiting (same pattern as recommendations)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 15; // 15 requests per window (slightly higher for chat)

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  rateLimitMap.set(ip, record);
  return true;
}

const SYSTEM_PROMPT = `You are RegWatch AI, an expert in Australian business compliance. You help small businesses understand their regulatory obligations including ATO (BAS, PAYG, super, FBT, income tax), ASIC (annual reviews, director duties), WHS, Fair Work, Privacy Act, state licensing, payroll tax, and workers compensation.

Your role:
- Provide actionable, practical advice on compliance obligations
- Cite specific regulations, legislation, and ATO/ASIC references where relevant
- Suggest concrete deadlines and remind users to add them to their calendar
- Explain complex regulatory concepts in plain English
- Highlight penalties for non-compliance when relevant
- Tailor advice to the user's business type, state, and industry when provided

Guidelines:
- Keep responses concise and practical (aim for 2-4 paragraphs maximum)
- Use British English spelling (organisation, licence, centre, etc.)
- If unsure about a specific detail, say so and recommend checking with the relevant authority
- For tax-specific questions, always recommend consulting a registered tax agent
- Format important deadlines or amounts clearly
- Use bullet points for lists of obligations or steps`;

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await request.json();

    // Input validation
    const validationResult = chatRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid input",
          details: validationResult.error.format(),
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages, businessContext } = validationResult.data;

    // Build system message with business context if provided
    let systemContent = SYSTEM_PROMPT;
    if (businessContext) {
      const contextParts = [];
      if (businessContext.type) contextParts.push(`Business type: ${businessContext.type}`);
      if (businessContext.state) contextParts.push(`State/Territory: ${businessContext.state}`);
      if (businessContext.industry) contextParts.push(`Industry: ${businessContext.industry}`);
      if (contextParts.length > 0) {
        systemContent += `\n\nUser's business context:\n${contextParts.join("\n")}`;
      }
    }

    const openai = getOpenAI();

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemContent },
        ...messages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      temperature: 0.4,
      stream: true,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
