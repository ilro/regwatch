import { PricingCards } from "@/components/pricing/pricing-cards";
import { LandingNav } from "@/components/landing/landing-nav";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — RegWatch",
  description:
    "Choose the right RegWatch plan for your business. Free starter plan available. No credit card required.",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main id="main-content" className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Simple, transparent pricing
              </h1>
              <p className="text-lg text-slate-600">
                Start free. Upgrade when you need more. No surprises.
              </p>
            </div>
            <PricingCards />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
