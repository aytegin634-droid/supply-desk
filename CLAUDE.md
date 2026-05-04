# Supply Desk — Контекст для AI-ассистента

> **Этот файл — резюме проекта для нового чата с Claude / другим AI-ассистентом.**
> Читайте этот файл первым, потом смотрите код в `app/`, `lib/`, `components/`.
> Обновляйте этот файл по мере развития проекта.

Последнее обновление: **май 2026**, после завершения Phase 1.

---

## О проекте

**Supply Desk** — внутренняя система заявок и закупок для ресторана **«Борсок»** (Бишкек, Кыргызстан). Заменяет ad-hoc мессенджер-чаты между кухней/баром/залом и закупщиком.

**Масштаб**: одна компания, 2 филиала (на Чуй, в Джале), ~9 сотрудников.

**Юзер-роли** (иерархия):
- `admin` — топ-админ (1 человек, владелец/менеджер). Полный доступ.
- `chef` — шеф-повар. Мастер-роль кухни. Видит свою команду.
- `head_barista` — старший бариста. Мастер-роль бара.
- `hall_admin` — админ зала. Мастер-роль зала.
- `staff` — обычный сотрудник (повар, бармен, официант).
- `buyer` — закупщик. Видит все заявки, формирует PO.

**Workflow**: повар/бариста/официант → создаёт заявку → закупщик группирует по поставщикам → отправляет PO → товары приходят → производство принимает.

---

## Технологический стек

- **Frontend + Backend**: Next.js 16 (App Router, Turbopack, TypeScript)
- **Стили**: Tailwind CSS v4 (через `@theme` в `globals.css`)
- **БД**: Supabase (Postgres 15+, RLS, Auth, Storage)
- **Иконки**: lucide-react
- **Шрифты**: Playfair Display (display), Manrope (sans), JetBrains Mono — все с кириллицей
- **Деплой**: Vercel (планируется, ещё не настроен)
- **Git**: GitHub (https://github.com/aytegin634-droid/supply-desk, **public** — нужно перевести в private)

---

## Архитектурные решения (КРИТИЧЕСКИЕ)

### 1. Авторизация: login-based, не email-based

Сотрудники у заведения (повара, бариста, официанты) **не имеют** рабочих email. Поэтому:

- Юзер вводит **логин** (например `chef`, `nuriya`), не email
- Внутри Supabase Auth хранится **синтетический email**: `${login}@borsok.local`
- На стороне UI юзер никогда не видит синтетический email
- Login Server Action (`app/login/actions.ts`) превращает логин в email перед `signInWithPassword`

**Domain для синтетических email**: `borsok.local` (от слова "borsok" — кыргызский хлеб; используется как внутренний domain).

### 2. Создание сотрудников через Server Action с service-role

Когда admin создаёт сотрудника:
1. Создать в `auth.users` через `supabase.auth.admin.createUser()` (требует **service-role key**)
2. Создать в `profiles` (имя, login, role, department)
3. Создать связи в `user_branches`

**Service-role ключ**: хранится в `.env.local` как `SUPABASE_SERVICE_ROLE_KEY` (БЕЗ префикса `NEXT_PUBLIC_`!). Используется **только в Server Actions**, никогда в client code.

### 3. Пароли: автогенерация при создании сотрудника

Admin не вводит пароли вручную. При создании юзера система генерирует случайный пароль (8 символов, alphanumeric uppercase) и показывает admin'у в плашке после создания. Admin копирует и сообщает сотруднику.

Сотрудник может сменить пароль через `/profile`.

### 4. RLS политики — БЕЗ рекурсии

**Грабли которые мы прошли** (НЕ повторять):
- ❌ В политиках на `profiles` НЕЛЬЗЯ делать прямые подзапросы на `profiles` — это создаёт рекурсию, Postgres возвращает 0 строк молча
- ❌ В политиках НЕЛЬЗЯ делать подзапросы на `user_branches`, у которой своя политика лезущая на `profiles`

**Правильный подход**:
- ✅ Использовать `SECURITY DEFINER` helper-функции (`current_company_id()`, `is_top_admin()`, etc.) — они выполняются с правами создателя БД, минуя RLS
- ✅ Использовать `(select auth.uid())` вместо `auth.uid()` для оптимизации (вычисляется один раз)
- ✅ Все функции с `set search_path = public`
- ✅ Все политики с `to authenticated`

См. `fix-rls.sql` для полного списка политик.

**Текущее упрощение**: master-роли (chef/head_barista/hall_admin) пока видят весь свой отдел в компании, **без фильтра по филиалам в SQL**. Фильтрация по филиалам — **на стороне приложения** (через `WHERE branch_id IN (...)` в запросах).

### 5. Категории — общие на всю компанию (не scoped по отделам)

В прототипе обсуждали — категории одинаковые для кухни/бара. Файлы Excel из 1С разделены (Кухня + Бар), но при импорте сливаются в общий каталог.

### 6. Поставщики — many-to-many с товарами + пауза/архив

- `product_suppliers` — связка многие-ко-многим
- `is_primary` — основной поставщик товара (только ОДИН на товар, через partial unique index)
- **Пауза** поставщика (`paused_at`, `paused_until`, `paused_reason`, `paused_by`) — временная, может ставить admin или buyer
- **Архивация** (`archived_at`, `archived_reason`) — постоянная, только admin
- При паузе позиции автоматически перераспределяются на резервных поставщиков (логика на стороне приложения)
- Если у товара нет активного поставщика — попадает в группу «Без активного поставщика» у закупщика

### 7. Архивация филиалов с проверками

- `branches.archived_at` — soft delete
- При попытке архивировать **проверяется**:
  - Нет ли активных заявок (`status = 'active'`) — если есть, кнопка блокируется
  - Не последний ли это активный филиал — нельзя архивировать единственный
- При архивации сотрудники автоматически отвязываются от филиала через `delete from user_branches`

### 8. Синхронизация Excel из 1С

**Формат файлов**:
- Колонка одна, "Наименование"
- Строки **без скобок** = категории (например "Овощи")
- Строки **со скобками** = товары формата "Название (единица)" (например "Помидоры (кг)")
- Артикулов/SKU **НЕТ** — match только по нормализованному имени

**Парсер** (логика):
- Lowercase, убрать кавычки `«»"'`, нормализовать пробелы
- Единицы: `пор` → `порц`, `1лт` → `лт`
- Мусорные строки (только цифры, < 3 символов) — пропускать
- match_key = `${normalized_name}|${normalized_unit}`

**Поведение при синхронизации**:
- Новые товары → добавляются с `supplier_id = NULL` (попадают в "Без поставщика")
- Существующие товары → обновляется `last_synced_at`, поставщик НЕ перезаписывается
- Отсутствующие в файле → `archived_at = now()` (soft-delete)
- При повторной появлении → разархивируются

**Алиасы**: для случаев типа "Чай Зеленный" → "Чай Зелёный" (опечатки) — таблица `product_aliases`.

---

## Текущее состояние (Phase 1 завершена)

### ✅ Что сделано

**База данных** (Supabase, регион Mumbai South Asia):
- Полная схема в `db/schema.sql` — 13 таблиц, 4 enum'а, 7 helper-функций
- RLS политики переcобраны через `db/fix-rls.sql`
- Seed: 1 компания (id `00000000-0000-0000-0000-000000000001`, name "Чайхана «Жибек Жолу»")
- Admin auth-юзер создан (`admin@borsok.local`, login `admin`, role `admin`)

**Next.js приложение**:
- Подключён Supabase через `@supabase/ssr`
- Server-клиент: `lib/supabase/server.ts`
- Browser-клиент: `lib/supabase/client.ts`
- TypeScript типы из БД: `lib/database.types.ts` (сгенерированы через Dashboard, не CLI)
- Middleware: `middleware.ts` — обновляет сессию, редиректит незалогиненных на `/login`
- Login page: `app/login/` — принимает логин (не email), синтезирует email перед вызовом Auth
- Главная: `app/page.tsx` — приветствие, ссылки на профиль/заведение, кнопка выхода
- Профиль: `app/profile/` — данные юзера + смена пароля
- Заведение: `app/venue/` — название компании + CRUD филиалов с архивацией (только для admin)

**Компоненты**:
- `components/HoldChip.tsx` — hold-to-confirm кнопка для деструктивных действий

**GitHub**:
- Репо: https://github.com/aytegin634-droid/supply-desk
- ⚠️ **ПУБЛИЧНЫЙ** — нужно перевести в Private

### 📋 Структура файлов

```
supply-desk/
├── app/
│   ├── login/
│   │   ├── actions.ts          # loginAction (логин → синт. email → Supabase)
│   │   └── page.tsx
│   ├── profile/
│   │   ├── actions.ts          # changePasswordAction
│   │   ├── page.tsx
│   │   └── profile-form.tsx
│   ├── venue/
│   │   ├── actions.ts          # update/create/archive/restore branches + company
│   │   ├── branches-section.tsx
│   │   ├── company-form.tsx
│   │   ├── new-branch-form.tsx
│   │   └── page.tsx
│   ├── actions.ts              # signOutAction
│   ├── globals.css             # Tailwind v4 + design tokens
│   ├── layout.tsx
│   └── page.tsx                # Главная
├── components/
│   └── HoldChip.tsx
├── lib/
│   ├── database.types.ts       # Generated from Supabase
│   └── supabase/
│       ├── client.ts
│       └── server.ts
├── db/                         # SQL файлы (если ещё не созданы — создать)
│   ├── schema.sql
│   └── fix-rls.sql
├── middleware.ts
├── .env.local                  # SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY
├── CLAUDE.md                   # этот файл
└── ...
```

### 🎨 Дизайн-токены (в `app/globals.css`)

```css
--color-cream: #f5f1e8;        /* фон страницы */
--color-paper: #faf7f0;        /* фон карточек */
--color-ink: #1c1915;          /* основной текст */
--color-ink-soft: #4a4238;     /* вторичный текст */
--color-rule: #d9cfbb;         /* границы */
--color-rule-soft: #ebe3d2;    /* мягкие границы */
--color-brick: #b84a2e;        /* primary action (кирпичный) */
--color-brick-deep: #8a3520;   /* деструктивные действия */
--color-sage: #5a7a4a;         /* успех */
--color-amber: #c68a2e;        /* предупреждения */
```

Стиль — кремовый с серифным заголовком, как в "ресторанной" эстетике. **Менять цвета — только через эти токены**, не хардкодить hex в компонентах.

---

## Что НЕ сделано (дорожная карта)

### Phase 2: Сотрудники (следующая большая задача)

- Страница `/team` — список сотрудников
- Форма создания нового сотрудника (имя, логин, роль, отдел, филиалы)
- Создание через Server Action с service-role (`auth.admin.createUser`)
- Автогенерация пароля + копирование
- Редактирование сотрудника
- Hold-to-confirm удаление
- Hold-to-confirm сброс пароля админом
- Права: admin создаёт всех; chef/head_barista/hall_admin создают только своих staff на своих филиалах

### Phase 3: Каталог + Поставщики + Синхронизация

- Страница `/catalog` с подвкладками: Категории, Товары, Поставщики, Синхронизация
- CRUD категорий
- CRUD товаров (вручную)
- CRUD поставщиков с паузой/архивом
- Связь товаров↔поставщики (с primary)
- Загрузчик Excel: парсер + diff-превью + hold-to-confirm применение
- Журнал синхронизаций (`sync_log`)

### Phase 4: Заявки (главное мясо приложения)

- Создание заявки от повара/бариста/официанта
- Черновики
- Per-line статусы (pending/ordered/arrived/received/partial/missing/cancelled)
- Страница закупщика — группировка по поставщикам
- Окно отправки PO (с hold-to-confirm)
- Перераспределение позиций при паузе поставщика
- Приёмка по позициям
- Закрытие заявок

### Phase 5: Шлифовка + Deploy

- Hover-эффекты на всех кнопках/ссылках (`transition-colors`, `hover:bg-paper`, etc.)
- Vercel деплой
- Realtime обновления (Supabase Realtime для уведомлений закупщика)
- Логирование ошибок
- Backup стратегия

### Возможно потом

- Telegram бот для уведомлений (закупщику о новых заявках, поварам о приёмке)
- Аналитика расходов по поставщикам
- Цены закупки в `product_suppliers.price` для отчётности

---

## Ключевые решения уже принятые (не пересматривать без причины)

- ✅ TypeScript, не JavaScript
- ✅ Next.js монолит (один репо, Server Components + Server Actions)
- ✅ Supabase (не Firebase, не свой Postgres) — критично для RLS, Auth, Realtime в одном месте
- ✅ Один Supabase проект (без отдельного dev/prod пока) — добавим перед релизом
- ✅ Vercel для хостинга (Hobby tier на старте, Pro когда понадобится)
- ✅ Логин-based auth (синтетические email `@borsok.local`)
- ✅ Автогенерация паролей сотрудникам
- ✅ Soft-delete везде где есть исторические ссылки (filials, products, suppliers)
- ✅ RLS через SECURITY DEFINER функции (НЕ прямые подзапросы)
- ✅ Категории общие на всю компанию (не scoped по отделам)
- ✅ Поставщики M2M с товарами, primary через partial unique index

---

## Полезные команды

```cmd
# Запуск dev
npm run dev

# Production build для теста скорости
npm run build && npm run start

# Git workflow
git add .
git commit -m "..."
git push

# Регенерация Supabase типов (когда схема меняется)
# Пока вручную через Dashboard → API → TypeScript Types
# Будущее: supabase gen types typescript --linked > lib/database.types.ts
```

---

## Контакты и доступы (НЕ КОММИТИТЬ В РЕПО)

- **Supabase project**: lgjawpuzgwblqjzxigwl (URL `https://lgjawpuzgwblqjzxigwl.supabase.co`)
- **Supabase region**: South Asia (Mumbai), `ap-south-1`
- **Admin login**: `admin` / пароль в личном менеджере паролей
- **GitHub**: aytegin634-droid

⚠️ **Никогда не коммитить в репо**:
- `.env.local`
- service_role key
- Пароли пользователей
- Database password Supabase

---

## Заметки для будущих сессий с Claude

1. **Всегда сначала смотри этот файл и репозиторий**, прежде чем задавать вопросы
2. **При архитектурных решениях** — сверяйся с разделом "Архитектурные решения"
3. **Не предлагай менять**: tech-stack, RLS-подход, auth-стратегию, soft-delete подход — без серьёзной причины
4. **Не пересоздавай**: схему БД, helper-функции, базовые компоненты типа HoldChip
5. **Дизайн** — через CSS-токены, не inline hex
6. **Server-actions** для всех мутаций, не client-side вызовы Supabase для записи
7. **TypeScript строгий** — все Server Actions возвращают `{ ok: true } | { ok: false; reason: string }`, fallback `result.reason || "default"` обязателен
8. **Hold-to-confirm** для всех деструктивных действий (удаление, архивация, сброс пароля)
9. **Каждая большая задача — новая сессия**, чтобы не забивать контекст

---

## Грабли которые мы уже прошли (не повторять)

- ❌ Использование `<form>` тегов в Artifacts — НЕ работает, используй `<div>` + `onClick`
- ❌ Прямые подзапросы на `profiles` в политиках на `profiles` — рекурсия, RLS возвращает 0 строк
- ❌ `setTimeout` в submit handler — проблематично, лучше синхронно
- ❌ Auth с реальными email для всех сотрудников — у поваров/официантов их нет
- ❌ `currentUser` без `null`-check — падает при logout
- ❌ Загрузка cookies в Server Component без `await cookies()` (Next.js 15+)
- ❌ Хранение пароля отдельной таблицей — race conditions, лучше как поле user'а (но всё равно лучше через Supabase Auth, как сейчас)

---

*Этот документ — живой, обновляйте его после каждой завершённой Phase или важных решений.*