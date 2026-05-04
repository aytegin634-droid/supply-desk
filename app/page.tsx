import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "./actions";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user!.id)
    .single();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-display font-semibold">
          Здравствуйте, {profile?.name || "пользователь"} 👋
        </h1>
        <p className="text-ink-soft mt-2">
          Роль: <b>{profile?.role || "—"}</b>
        </p>
        <p className="text-ink-soft mt-1">
          Email: {user?.email}
        </p>

        <div className="mt-8 p-6 rounded-2xl bg-paper border border-rule">
          <h2 className="text-lg font-display font-semibold mb-2">Что работает прямо сейчас</h2>
          <ul className="text-sm text-ink-soft list-disc pl-5 space-y-1">
            <li>Регистрация и вход</li>
            <li>Защита всех страниц (без логина — на /login)</li>
            <li>Профиль из БД через RLS</li>
          </ul>
          <p className="text-xs text-ink-soft mt-4 italic">
            Дальше: страницы заявок, поставщики, каталог, синхронизация.
          </p>
        </div>

        <div className="mt-6 flex gap-3 flex-wrap">
          <a
            href="/profile"
            className="text-sm px-4 py-2 rounded-full font-semibold border border-rule hover:bg-paper transition-colors"
          >
            Мой профиль
          </a>
          {profile?.role === "admin" && (
            <a
              href="/venue"
              className="text-sm px-4 py-2 rounded-full font-semibold border border-rule hover:bg-paper transition-colors"
            >
              Заведение
            </a>
          )}
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-sm px-4 py-2 rounded-full font-semibold border border-rule hover:bg-paper transition-colors"
            >
              Выйти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}