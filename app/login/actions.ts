"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(formData: { email: string; password: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { ok: false, reason: "Неверный email или пароль" };
    }
    return { ok: false, reason: error.message };
  }

  if (!data.user) {
    return { ok: false, reason: "Не удалось войти" };
  }

  redirect("/");
}