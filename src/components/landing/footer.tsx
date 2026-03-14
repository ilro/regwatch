import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12" aria-label="Footer">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <span className="text-lg font-bold text-slate-900" aria-hidden="true">RegWatch</span>
          </div>
          <nav className="flex gap-6 text-sm text-slate-600" aria-label="Footer navigation">
            <Link href="/auth/signin" className="hover:text-slate-900">
              Sign in
            </Link>
            <Link href="/auth/signup" className="hover:text-slate-900">
              Get started
            </Link>
          </nav>
          <p className="text-sm text-slate-500" aria-hidden="true">
            &copy; {new Date().getFullYear()} RegWatch. All rights reserved.
          </p>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8 text-center">
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
