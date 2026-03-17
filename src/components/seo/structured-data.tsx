export function StructuredData() {
  const organisation = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RegWatch",
    url: "https://regwatch.com.au",
    logo: "https://regwatch.com.au/logo.png",
    description:
      "AI-powered compliance tracking for Australian small businesses. Never miss an ATO, ASIC, or state regulatory deadline.",
    foundingDate: "2025",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AU",
    },
    sameAs: [],
  };

  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RegWatch",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: [
      {
        "@type": "Offer",
        name: "Starter",
        price: "0",
        priceCurrency: "AUD",
      },
      {
        "@type": "Offer",
        name: "Business",
        price: "19",
        priceCurrency: "AUD",
        unitText: "MONTH",
      },
      {
        "@type": "Offer",
        name: "Practice",
        price: "79",
        priceCurrency: "AUD",
        unitText: "MONTH",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },
    description:
      "AI-powered compliance tracking for Australian small businesses. Tracks ATO, ASIC, Fair Work, and state regulatory deadlines.",
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is there really a free plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! The Starter plan is completely free forever. It includes up to 5 compliance deadlines with email reminders.",
        },
      },
      {
        "@type": "Question",
        name: "What happens after the 14-day free trial?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "After your trial ends, you can choose to subscribe to the Business plan or continue with the free Starter plan.",
        },
      },
      {
        "@type": "Question",
        name: "Can I cancel anytime?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. There are no lock-in contracts. Cancel your subscription at any time from your account settings.",
        },
      },
      {
        "@type": "Question",
        name: "Which regulators do you cover?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We cover federal regulators (ATO, ASIC, Fair Work Ombudsman, Safe Work Australia) plus all state and territory regulators.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data secure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We use enterprise-grade encryption, host on Australian servers, and comply with the Australian Privacy Principles.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(software) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
