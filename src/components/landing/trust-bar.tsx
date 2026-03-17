const logos = [
  "CPA Australia",
  "Xero",
  "MYOB",
  "Australian Taxation Office",
  "ASIC",
];

export function TrustBar() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/50 py-10" aria-label="Trusted by">
      <div className="container mx-auto px-4">
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-slate-400">
          Trusted by 2,000+ Australian businesses
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((name) => (
            <div
              key={name}
              className="flex h-10 items-center rounded-md bg-slate-100 px-5 text-sm font-semibold text-slate-400"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
