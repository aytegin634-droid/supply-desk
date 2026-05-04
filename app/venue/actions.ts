"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const COMPANY_ID = "00000000-0000-0000-0000-000000000001";

// === Изменить имя компании ===
export async function updateCompanyNameAction(name: string) {
  if (!name.trim() || name.trim().length < 2) {
    return { ok: false, reason: "Слишком короткое название" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("companies")
    .update({ name: name.trim() })
    .eq("id", COMPANY_ID);

  if (error) return { ok: false, reason: error.message };
  revalidatePath("/venue");
  return { ok: true };
}

// === Создать филиал ===
export async function createBranchAction(input: { name: string; address: string }) {
  const name = input.name.trim();
  const address = input.address.trim();

  if (name.length < 2) return { ok: false, reason: "Слишком короткое название" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("branches")
    .insert({
      company_id: COMPANY_ID,
      name,
      address: address || null,
    });

  if (error) {
    if (error.code === "23505") return { ok: false, reason: "Филиал с таким именем уже есть" };
    return { ok: false, reason: error.message };
  }
  revalidatePath("/venue");
  return { ok: true };
}

// === Архивировать филиал ===
export async function archiveBranchAction(branchId: string) {
  const supabase = await createClient();

  // Проверяем — нет ли открытых заявок на этом филиале
  const { count: openRequests, error: countError } = await supabase
    .from("requests")
    .select("id", { count: "exact", head: true })
    .eq("branch_id", branchId)
    .eq("status", "active");

  if (countError) return { ok: false, reason: countError.message };
  if (openRequests && openRequests > 0) {
    return { ok: false, reason: `На филиале ${openRequests} активных заявок — сначала закройте их` };
  }

  // Проверяем — это не последний активный филиал?
  const { count: activeCount, error: activeError } = await supabase
    .from("branches")
    .select("id", { count: "exact", head: true })
    .eq("company_id", COMPANY_ID)
    .is("archived_at", null);

  if (activeError) return { ok: false, reason: activeError.message };
  if (activeCount === 1) {
    return { ok: false, reason: "Нельзя архивировать единственный активный филиал" };
  }

  // Архивируем
  const { error } = await supabase
    .from("branches")
    .update({ archived_at: new Date().toISOString() })
    .eq("id", branchId);

  if (error) return { ok: false, reason: error.message };

  // Отвязываем сотрудников от архивного филиала
  await supabase.from("user_branches").delete().eq("branch_id", branchId);

  revalidatePath("/venue");
  return { ok: true };
}

// === Восстановить филиал ===
export async function restoreBranchAction(branchId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("branches")
    .update({ archived_at: null })
    .eq("id", branchId);

  if (error) return { ok: false, reason: error.message };
  revalidatePath("/venue");
  return { ok: true };
}