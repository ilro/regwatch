import { Calendar, Sparkles, Bell, Shield, Clock, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Compliance Calendar",
    description:
      "Automatically generates a personalised calendar of every BAS, super guarantee, ASIC review, and state-specific deadline for your business type and location.",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description:
      "Our AI analyses your business profile and identifies compliance requirements you might have missed — from payroll tax thresholds to industry-specific licences.",
  },
  {
    icon: Bell,
    title: "Email Reminders",
    description:
      "Receive timely alerts 7 days and 1 day before each deadline. Never face an ATO penalty or late lodgement fee again.",
  },
  {
    icon: Shield,
    title: "AU Regulatory Expertise",
    description:
      "Built specifically for Australian regulations across all states and territories. Federal, state, and local requirements in one place.",
  },
  {
    icon: Clock,
    title: "Track & Complete",
    description:
      "Mark deadlines as complete, add custom compliance items, and maintain an audit trail of your compliance history.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Overview",
    description:
      "See your compliance status at a glance with colour-coded urgency indicators. Know what&apos;s overdue, upcoming, and completed.",
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Everything you need to stay compliant
          </h2>
          <p className="text-lg text-slate-600">
            From BAS lodgement to workers compensation renewals — we track it
            all so you can focus on running your business.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-100">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
