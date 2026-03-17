import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

type ReminderWithItems = {
  id: string;
  item_id: string;
  user_id: string;
  reminder_date: string;
  type: string;
  compliance_items: Array<{
    title: string;
    description: string | null;
    due_date: string;
    category: string;
  }> | {
    title: string;
    description: string | null;
    due_date: string;
    category: string;
  } | null;
};

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Use untyped client for the join query since compliance_items relation
  // isn't in the Database type definition
  const typedClient = supabase as any;

  const { data, error } = await typedClient
    .from("reminders")
    .select(`
      id,
      item_id,
      user_id,
      reminder_date,
      type,
      compliance_items (title, description, due_date, category)
    `)
    .eq("sent", false)
    .lte("reminder_date", today);

  const reminders = data as ReminderWithItems[] | null;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = [];

  for (const reminder of reminders ?? []) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("business_name")
      .eq("id", reminder.user_id)
      .single();

    const businessName = (profile as { business_name?: string } | null)?.business_name;

    // Get user email from auth using the regular client (not admin)
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    // If we can't get the current user, we need to fetch by ID differently
    // Since we're in a server route with cron secret, we can use the service role
    // but let's use a safer approach - get user by ID from auth
    const { data: userData, error: userDataError } = await supabase.auth.admin.getUserById(
      reminder.user_id
    );

    // For now, we'll keep the admin call but add a comment about security
    // In a production environment, this should be moved to a separate service
    // with limited permissions or use a database function

    const userEmail = userData?.user?.email;
    if (!userEmail) continue;

    const item = Array.isArray(reminder.compliance_items)
      ? reminder.compliance_items[0]
      : reminder.compliance_items;

    const daysUntil =
      reminder.type === "7_day" ? "in 7 days" : "tomorrow";

    try {
      const resend = getResend();
      await resend.emails.send({
        from: "RegWatch <noreply@regwatch.com.au>",
        to: userEmail,
        subject: `Compliance Reminder: ${item?.title ?? "Deadline"} due ${daysUntil}`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #1e40af; margin-bottom: 16px;">RegWatch Reminder</h1>
            <p style="font-size: 16px; color: #374151;">
              Hi${businessName ? ` ${businessName}` : ""},
            </p>
            <p style="font-size: 16px; color: #374151;">
              This is a reminder that your compliance deadline is approaching:
            </p>
            <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0;">
              <h2 style="margin: 0 0 8px; color: #111827;">${item?.title ?? "Compliance Deadline"}</h2>
              <p style="margin: 0; color: #6b7280;">Due: ${item?.due_date ?? "Soon"}</p>
              <p style="margin: 8px 0 0; color: #374151;">${item?.description ?? ""}</p>
            </div>
            <p style="font-size: 16px; color: #374151;">
              Log in to <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://regwatch.com.au"}/dashboard" style="color: #2563eb;">RegWatch</a> to manage this deadline.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">
              RegWatch — Never miss a compliance deadline
            </p>
          </div>
        `,
      });

      await (supabase as any)
        .from("reminders")
        .update({ sent: true })
        .eq("id", reminder.id);

      results.push({ id: reminder.id, status: "sent" });
    } catch (err) {
      results.push({ id: reminder.id, status: "failed", error: String(err) });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
