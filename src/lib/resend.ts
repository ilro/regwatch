import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ReminderEmailParams {
  to: string;
  businessName: string;
  itemTitle: string;
  dueDate: string;
  daysUntil: number;
  category: string;
  description: string | null;
}

export async function sendReminderEmail(params: ReminderEmailParams) {
  const { to, businessName, itemTitle, dueDate, daysUntil, category, description } = params;

  const urgencyText = daysUntil <= 1 ? "URGENT" : daysUntil <= 7 ? "Upcoming" : "Reminder";
  const daysText = daysUntil === 0 ? "TODAY" : daysUntil === 1 ? "tomorrow" : `in ${daysUntil} days`;

  const subject = `${urgencyText}: ${itemTitle} is due ${daysText}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 700; color: #0f172a; }
    .logo span { color: #3b82f6; }
    .urgency { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 16px; }
    .urgent { background: #fef2f2; color: #dc2626; }
    .upcoming { background: #fffbeb; color: #d97706; }
    .info { background: #f0f9ff; color: #0284c7; }
    h1 { font-size: 20px; color: #0f172a; margin: 0 0 8px 0; }
    .subtitle { color: #64748b; font-size: 14px; margin: 0 0 24px 0; }
    .details { background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; font-size: 13px; }
    .detail-value { color: #0f172a; font-size: 13px; font-weight: 500; }
    .cta { display: block; background: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; text-align: center; font-weight: 600; margin-bottom: 24px; }
    .footer { text-align: center; color: #94a3b8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">Reg<span>Watch</span></div>
      </div>
      <div style="text-align: center;">
        <span class="urgency ${daysUntil <= 1 ? 'urgent' : daysUntil <= 7 ? 'upcoming' : 'info'}">${urgencyText}</span>
        <h1>${itemTitle}</h1>
        <p class="subtitle">This compliance item is due ${daysText}</p>
      </div>
      <div class="details">
        <div class="detail-row">
          <span class="detail-label">Business</span>
          <span class="detail-value">${businessName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Due Date</span>
          <span class="detail-value">${dueDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Category</span>
          <span class="detail-value">${category}</span>
        </div>
        ${description ? `<div class="detail-row">
          <span class="detail-label">Details</span>
          <span class="detail-value">${description}</span>
        </div>` : ""}
      </div>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://regwatch.app"}/dashboard" class="cta">
        View in RegWatch Dashboard →
      </a>
      <div class="footer">
        <p>You're receiving this because you set up compliance reminders in RegWatch.</p>
        <p>© ${new Date().getFullYear()} RegWatch — AI-Powered Compliance for Australian Businesses</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  return resend.emails.send({
    from: "RegWatch <reminders@regwatch.app>",
    to: [to],
    subject,
    html,
  });
}
