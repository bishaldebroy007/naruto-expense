# 🍥 Naruto Finance - AI Instructions

This document provides architectural context, development standards, and operational guidelines for the Naruto Finance project. Use this as a foundational reference for all AI-assisted development tasks.

## 🏗️ Project Overview
**Naruto Finance** is a themed expense tracker built with a modern Next.js 16 stack. It integrates Supabase for authentication and PostgreSQL storage, utilizing Drizzle ORM for type-safe database interactions.

### Core Technologies
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Database**: Supabase PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth (with SSR support)
- **Styling**: Tailwind CSS 4 + Radix UI (Shadcn/ui)
- **Charts**: Recharts
- **Icons**: Hugeicons + Lucide React

---

## 📂 Project Structure
- `app/`: Next.js App Router (Dashboard, Auth, Landing pages).
- `components/`: UI and business logic components.
  - `ui/`: Custom Shadcn components.
- `lib/`: Core utilities and configurations.
  - `db/`: Database schema definitions and server actions.
  - `supabase/`: Client and server-side Supabase configuration.
  - `utils/`: Helper functions (e.g., currency formatting).
- `drizzle/`: SQL migration files and snapshots.
- `public/`: Static assets and icons.

---

## 💾 Database & Data Model
The database consists of three primary tables managed via Drizzle ORM:
- **`users`**: Extended profile information linked to Supabase Auth.
- **`expenses`**: Individual transaction records.
  - `amount`: Stored as `integer` (cents) to avoid floating-point issues.
  - `category`: Enum (Food, Transport, Shopping, Bills, Entertainment, Health, Other).
- **`user_limits`**: Daily, monthly, and yearly spending thresholds.

### Key Drizzle Commands
- **Sync Schema**: `pnpm drizzle-kit push` (Immediate sync for development).
- **Generate Migrations**: `pnpm drizzle-kit generate` (Production ready).
- **Drizzle Studio**: `pnpm drizzle-kit studio` (Visual DB explorer).

---

## 🛠️ Development Workflow

### Building and Running
- **Development**: `pnpm dev`
- **Production Build**: `pnpm build`
- **Linting**: `pnpm lint`

### Coding Standards
1.  **Server Actions**: All database mutations (CRUD) MUST be implemented as server actions in `lib/db/actions.ts`.
2.  **Type Safety**: Use `$inferSelect` and `$inferInsert` from Drizzle for data types. Avoid `any` at all costs.
3.  **UI Components**: Prefer using or extending components in `components/ui/` built with Radix and Tailwind.
4.  **Theme Integrity**: Adhere to the Naruto-inspired theme.
    - **Leaf Village**: Light mode (Orange accents).
    - **Akatsuki**: Dark mode (Red accents).
5.  **Revalidation**: Always use `revalidatePath` in server actions after mutations to ensure data freshness in the App Router.

---

## 🔐 Security & Auth
- **Middleware**: Authentication is enforced in `middleware.ts`. Dashboard routes (`/dashboard/*`) require an active session.
- **Row Level Security (RLS)**: While Drizzle handles the application layer, ensure Supabase RLS is configured to restrict data access to the `owner_id`.
- **Environment Variables**: Never commit `.env` or `.env.local`. Required keys:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `DATABASE_URL` (Direct Postgres connection for Drizzle)

---

## 🍥 Naruto Theme Constants
- **Primary Color (Leaf)**: `#F97316` (Orange)
- **Primary Color (Akatsuki)**: `#EF4444` (Red)
- **Loading State**: Use the `RasenganLoader` component for major transitions.
