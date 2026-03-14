import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main id="main-content">
        <Hero />
        <Features />
        <Footer />
      </main>
    </div>
  );
}
