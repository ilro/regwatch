"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, HelpCircle } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for getting started with compliance tracking.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: "Get started free",
    ctaHref: "/auth/signup",
    popular: false,
    features: [
      "Up to 5 compliance deadlines",
      "Email reminders (7-day, 1-day)",
      "Basic calendar view",
      "ATO deadline tracking",
    ],
  },
  {
    name: "Business",
    description: "For growing businesses that need full compliance coverage.",
    monthlyPrice: 19,
    yearlyPrice: 190,
    cta: "Start free trial",
    ctaHref: "/auth/signup?plan=business",
    popular: true,
    features: [
      "Unlimited deadlines",
      "AI compliance recommendations",
      "AI chat assistant",
      "All regulators (ATO, ASIC, Fair Work, WHS, state)",
      "Priority email reminders",
      "Compliance score & reporting",
      "Calendar export",
    ],
  },
  {
    name: "Practice",
    description: "For accountants and firms managing multiple clients.",
    monthlyPrice: 79,
    yearlyPrice: 790,
    cta: "Contact sales",
    ctaHref: "mailto:sales@regwatch.com.au",
    popular: false,
    features: [
      "Everything in Business",
      "Multi-client management",
      "Team access (up to 10 users)",
      "Custom branding",
      "API access",
      "Priority support",
    ],
  },
];

const faqs = [
  {
    question: "Is there really a free plan?",
    answer:
      "Yes! The Starter plan is completely free forever. It includes up to 5 compliance deadlines with email reminders — enough to cover your most critical ATO obligations.",
  },
  {
    question: "What happens after the 14-day free trial?",
    answer:
      "After your trial ends, you can choose to subscribe to the Business plan or continue with the free Starter plan. We'll never charge you without your explicit consent.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. There are no lock-in contracts. Cancel your subscription at any time from your account settings, and you'll retain access until the end of your billing period.",
  },
  {
    question: "Which regulators do you cover?",
    answer:
      "We cover federal regulators (ATO, ASIC, Fair Work Ombudsman, Safe Work Australia) plus all state and territory regulators for payroll tax, workers compensation, and licensing requirements.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use enterprise-grade encryption, host on Australian servers, and comply with the Australian Privacy Principles. Your business data is never shared with third parties.",
  },
];

export function PricingCards() {
  const [annual, setAnnual] = useState(true);

  return (
    <div>
      {/* Toggle */}
      <div className="mb-12 flex items-center justify-center gap-3">
        <span
          className={`text-sm font-medium ${!annual ? "text-slate-900" : "text-slate-500"}`}
        >
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            annual ? "bg-blue-600" : "bg-slate-300"
          }`}
          role="switch"
          aria-checked={annual}
          aria-label="Toggle annual billing"
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              annual ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium ${annual ? "text-slate-900" : "text-slate-500"}`}
        >
          Annual
        </span>
        {annual && (
          <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Save 17%
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => {
          const price = annual ? plan.yearlyPrice : plan.monthlyPrice;
          const period = annual ? "/year" : "/month";

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border bg-white ${
                plan.popular
                  ? "border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
                  : "border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              <div className="border-b border-slate-100 p-6 pb-4">
                <h3 className="text-xl font-semibold text-slate-900">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {plan.description}
                </p>
              </div>
              <div className="flex-1 p-6">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900">
                    ${price === 0 ? "0" : price}
                  </span>
                  {price > 0 && (
                    <span className="text-sm text-slate-500">{period}</span>
                  )}
                  {price === 0 && (
                    <span className="text-sm text-slate-500"> forever</span>
                  )}
                  {annual && plan.monthlyPrice > 0 && (
                    <p className="mt-1 text-xs text-slate-500">
                      ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(0)}{" "}
                      saved per year
                    </p>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-slate-700"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-green-600"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-slate-100 p-6">
                <Link
                  href={plan.ctaHref}
                  className={`inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg px-6 text-sm font-medium transition-colors ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {plan.cta}
                  {plan.cta !== "Contact sales" && (
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust signals */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
          No credit card required
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
          Cancel anytime
        </span>
        <span className="flex items-center gap-1.5">
          <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
          Australian data hosting
        </span>
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-lg border border-slate-200 bg-white p-6"
            >
              <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-900">
                <HelpCircle
                  className="h-4 w-4 text-blue-600"
                  aria-hidden="true"
                />
                {faq.question}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
