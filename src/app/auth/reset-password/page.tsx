export const dynamic = "force-dynamic";

import { PasswordResetForm } from "@/components/auth/password-reset-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — RegWatch",
  description: "Reset your RegWatch account password.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        <a
          href="/"
          className="mb-8 block text-center text-2xl font-bold tracking-tight"
        >
          Reg<span className="text-primary">Watch</span>
        </a>
        <PasswordResetForm />
      </div>
    </div>
  );
}
