import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, login, role, department, company_id")
    .eq("id", user.id)
    .single();
  console.log(profile)
  if (!profile) {
    return (
      <div className="p-8 text-center">
        Профиль не найден. Обратитесь к администратору.
      </div>
    );
  }

  // Загружаем филиалы юзера
  const { data: userBranches } = await supabase
    .from("user_branches")
    .select("branches(name)")
    .eq("user_id", user.id);

  const branchNames = userBranches?.map((ub) => ub.branches?.name).filter(Boolean).join(", ") || "—";

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-soft font-mono">
            Личный кабинет
          </div>
          <h1 className="text-3xl mt-1 font-display font-semibold tracking-tight">
            Мой профиль
          </h1>
        </div>

        <section className="rounded-2xl p-5 bg-paper border border-rule">
          <div className="text-xs uppercase tracking-wider text-ink-soft font-mono font-bold mb-3">
            Учётные данные
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Field label="Имя" value={profile.name} />
            <Field label="Логин" value={`@${profile.login}`} />
            <Field label="Email" value={user.email || "—"} />
            <Field label="Роль" value={roleLabel(profile.role)} />
            {profile.department && (
              <Field label="Отдел" value={departmentLabel(profile.department)} />
            )}
            <Field label="Филиалы" value={branchNames} />
          </div>
        </section>

        <ProfileForm />
        <a
          href="/"
          className="text-sm text-ink-soft hover:text-ink underline self-start"
        >
          ← Назад
        </a>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-ink-soft mb-0.5">
        {label}
      </div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function roleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: "Администратор",
    chef: "Шеф-повар",
    head_barista: "Ст. бариста",
    hall_admin: "Админ зала",
    staff: "Сотрудник",
    buyer: "Закупщик",
  };
  return labels[role] || role;
}

function departmentLabel(dept: string): string {
  const labels: Record<string, string> = {
    kitchen: "Кухня",
    bar: "Бар",
    hall: "Зал",
  };
  return labels[dept] || dept;
}