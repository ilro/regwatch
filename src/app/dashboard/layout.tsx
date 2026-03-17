import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AIChat } from "@/components/dashboard/ai-chat";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        user={{
          email: user.email,
          name: user.user_metadata?.full_name ?? null,
        }}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader
          title="Dashboard"
          user={{
            email: user.email,
            name: user.user_metadata?.full_name ?? null,
          }}
        />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
          {children}
        </main>
      </div>
      <AIChat />
    </div>
  );
}
