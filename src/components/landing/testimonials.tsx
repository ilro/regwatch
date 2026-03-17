import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Sole Trader",
    location: "Melbourne",
    quote:
      "RegWatch saved me from a $4,500 ATO late lodgement penalty. The email reminders gave me plenty of notice to get my BAS in on time. Absolute game-changer for my consulting business.",
    rating: 5,
  },
  {
    name: "James K.",
    role: "Small Business Owner",
    location: "Sydney",
    quote:
      "I used to miss ASIC review deadlines every year. Since switching to RegWatch, I've been ahead of every single one. The AI recommendations even flagged payroll tax obligations I didn't know I had.",
    rating: 5,
  },
  {
    name: "Lisa & David Chen",
    role: "Family Partnership",
    location: "Brisbane",
    quote:
      "As a husband-and-wife team running a café, compliance was always overwhelming. RegWatch puts everything in one calendar with clear deadlines. We finally feel in control.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2
            id="testimonials-heading"
            className="mb-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"
          >
            Loved by Australian businesses
          </h2>
          <p className="text-lg text-slate-600">
            Join thousands who never worry about compliance deadlines.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mb-6 text-sm leading-relaxed text-slate-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div>
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">
                  {t.role} · {t.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
