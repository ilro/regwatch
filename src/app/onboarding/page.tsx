export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export const metadata: Metadata = {
  title: "Onboarding — RegWatch",
  description: "Set up your compliance tracking in three simple steps.",
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/" className="text-xl font-bold tracking-tight">
            Reg<span className="text-primary">Watch</span>
          </a>
          <span className="text-sm text-muted-foreground">
            Account setup
          </span>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <OnboardingForm />
      </main>
    </div>
  );
}
