import { ClipboardList, CalendarCheck, PartyPopper } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: ClipboardList,
    title: "Tell us about your business",
    description:
      "Answer a few quick questions about your business type, location, and structure. Takes under 2 minutes.",
  },
  {
    number: 2,
    icon: CalendarCheck,
    title: "Get your compliance calendar",
    description:
      "We instantly generate a personalised calendar with every regulatory deadline that applies to you — ATO, ASIC, Fair Work, and state requirements.",
  },
  {
    number: 3,
    icon: PartyPopper,
    title: "Never miss a deadline",
    description:
      "Receive timely email reminders, track completion, and let our AI flag obligations you might have missed.",
  },
];

export function HowItWorks() {
  return (
    <section
      className="bg-slate-50 py-20 md:py-24"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2
            id="how-it-works-heading"
            className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"
          >
            How it works
          </h2>
          <p className="text-lg text-slate-600">
            Three simple steps to total compliance confidence.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Connecting line (desktop) */}
          <div
            className="absolute left-1/2 top-12 hidden h-[calc(100%-6rem)] w-px -translate-x-1/2 bg-slate-200 md:block"
            aria-hidden="true"
          />

          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center">
                {/* Numbered circle */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white shadow-lg shadow-blue-600/20">
                  {step.number}
                </div>
                <div className="mx-auto mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
