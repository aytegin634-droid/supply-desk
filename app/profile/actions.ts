"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function changePasswordAction(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { ok: false, reason: "Сессия истекла, войдите заново" };
  }

  // Сначала проверяем текущий пароль через попытку входа
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: input.currentPassword,
  });

  if (signInError) {
    return { ok: false, reason: "Текущий пароль введён неверно" };
  }

  // Обновляем на новый
  const { error: updateError } = await supabase.auth.updateUser({
    password: input.newPassword,
  });

  if (updateError) {
    return { ok: false, reason: updateError.message };
  }

  revalidatePath("/profile");
  return { ok: true };
}