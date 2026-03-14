import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32" aria-label="Hero section">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" aria-hidden="true" />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <Shield className="h-4 w-4" aria-hidden="true" />
            Built for Australian small businesses
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Never miss a{" "}
            <span className="text-blue-600">compliance deadline</span>{" "}
            again
          </h1>
          <p className="mb-8 text-lg text-slate-600 md:text-xl">
            RegWatch tracks every ATO, ASIC, and state regulatory deadline for
            your business — with AI-powered recommendations and email reminders
            so nothing slips through the cracks.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 text-base font-medium text-white transition-colors hover:bg-blue-700"
              aria-label="Get started free button"
            >
              Get started free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-8 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
              aria-label="Sign in button"
            >
              Sign in
            </Link>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Free to start · No credit card required · Set up in 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
}
