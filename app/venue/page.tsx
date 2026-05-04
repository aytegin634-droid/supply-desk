import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CompanyForm from "./company-form";
import BranchesSection from "./branches-section";

const COMPANY_ID = "00000000-0000-0000-0000-000000000001";

export default async function VenuePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Проверка роли — только admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin") {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-paper border border-rule">
          <h1 className="text-xl font-display font-semibold">Доступ запрещён</h1>
          <p className="text-sm text-ink-soft mt-2">
            Эта страница доступна только администратору.
          </p>
          <a href="/" className="text-sm text-brick underline mt-4 inline-block">
            ← На главную
          </a>
        </div>
      </div>
    );
  }

  // Загружаем компанию и филиалы
  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("id", COMPANY_ID)
    .single();

  const { data: branches } = await supabase
    .from("branches")
    .select("id, name, address, archived_at")
    .eq("company_id", COMPANY_ID)
    .order("created_at");

  // Для каждого филиала — счётчик открытых заявок (для блокировки архивации)
  const activeBranchIds = (branches || [])
    .filter((b) => !b.archived_at)
    .map((b) => b.id);

  const openCounts: Record<string, number> = {};
  if (activeBranchIds.length > 0) {
    const { data: counts } = await supabase
      .from("requests")
      .select("branch_id")
      .in("branch_id", activeBranchIds)
      .eq("status", "active");

    if (counts) {
      for (const r of counts) {
        openCounts[r.branch_id] = (openCounts[r.branch_id] || 0) + 1;
      }
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-soft font-mono">
              Управление заведением
            </div>
            <h1 className="text-3xl mt-1 font-display font-semibold tracking-tight">
              Заведение
            </h1>
            <div className="text-xs mt-1 text-ink-soft">
              Название компании и список филиалов. Доступно только администратору.
            </div>
          </div>
          <a
            href="/"
            className="text-sm px-4 py-2 rounded-full font-semibold border border-rule hover:bg-paper transition-colors"
          >
            ← На главную
          </a>
        </div>

        <CompanyForm initialName={company?.name || ""} />

        <BranchesSection
          branches={branches || []}
          openCounts={openCounts}
        />
      </div>
    </div>
  );
}