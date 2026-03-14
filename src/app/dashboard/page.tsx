export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { DashboardContent } from "@/components/dashboard/dashboard-content";


export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const { data: items } = await supabase
    .from("compliance_items")
    .select("*")
    .eq("user_id", user.id)
    .order("due_date", { ascending: true });

  return (
    <DashboardContent
      items={items ?? []}
      userId={user.id}
    />
  );
}
