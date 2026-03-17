import Link from "next/link";
import { Shield } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/security" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Help Centre", href: "/help" },
    { label: "Compliance Guides", href: "/guides" },
  ],
};

export function Footer() {
  return (
    <footer
      className="border-t border-slate-200 bg-slate-50 py-12"
      aria-label="Footer"
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <span className="text-lg font-bold text-slate-900">RegWatch</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              AI-powered compliance tracking for Australian small businesses.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Product
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Company
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Resources
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 md:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} RegWatch. All rights reserved.
          </p>
          <nav className="flex gap-6 text-sm text-slate-600" aria-label="Footer navigation">
            <Link href="/auth/signin" className="hover:text-slate-900">
              Sign in
            </Link>
            <Link href="/auth/signup" className="hover:text-slate-900">
              Get started
            </Link>
          </nav>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            RegWatch provides general compliance information for Australian
            small businesses. It does not constitute legal or financial advice.
            Always consult a qualified professional for your specific
            circumstances.
          </p>
        </div>
      </div>
    </footer>
  );
}
