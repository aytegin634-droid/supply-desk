"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const EMAIL_DOMAIN = "borsok.local";

export async function loginAction(formData: { login: string; password: string }) {
  const supabase = await createClient();

  // Превращаем логин в синтетический email
  const email = `${formData.login.trim().toLowerCase()}@${EMAIL_DOMAIN}`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: formData.password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { ok: false, reason: "Неверный логин или пароль" };
    }
    return { ok: false, reason: error.message };
  }

  if (!data.user) {
    return { ok: false, reason: "Не удалось войти" };
  }

  redirect("/");
}