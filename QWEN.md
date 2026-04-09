# Naruto Finance - Project Context

## Project Overview

**Naruto Finance** is a full-featured, production-ready expense tracker web application with a Naruto anime theme. Built with Next.js 16 (App Router), TypeScript, Supabase (PostgreSQL + Auth), and Drizzle ORM, it provides secure authentication, complete expense CRUD operations, spending limit tracking with alerts, and beautiful data visualizations.

### Key Characteristics
- **Open-source** under MIT License
- **Mobile-responsive** with Tailwind CSS v4
- **Dual theme system**: Leaf Village (Light) and Akatsuki (Dark) with CSS variables
- **Secure**: Supabase Auth with email/password, OTP password reset, middleware route protection
- **Type-safe**: Full TypeScript strict mode throughout
- **Server-first**: Uses Next.js Server Components and Server Actions for database operations

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16.2.3 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Runtime | React 19.2.4 |
| Styling | Tailwind CSS v4 + shadcn/ui components |
| Database | Supabase (PostgreSQL) |
| ORM | Drizzle ORM 0.45.2 + drizzle-kit |
| Auth | Supabase Auth (@supabase/ssr, @supabase/supabase-js) |
| Charts | Recharts 3.8.1 |
| Icons | Lucide React + Hugeicons |
| Toasts | Sonner 2.0.7 |
| Package Manager | pnpm |

## Project Structure

```
naruto-expense/
├── app/                              # Next.js App Router
│   ├── dashboard/
│   │   ├── layout.tsx                # Dashboard layout with ThemeProvider + header
│   │   ├── page.tsx                  # Main dashboard: stats, charts, expense list
│   │   └── settings/page.tsx         # User settings: spending limits config
│   ├── forgot-password/page.tsx      # Password reset request (email OTP)
│   ├── reset-password/page.tsx       # OTP verification + new password set
│   ├── login/page.tsx                # Email/password login
│   ├── signup/page.tsx               # Email/password registration
│   ├── layout.tsx                    # Root layout (fonts, metadata, theme init)
│   ├── page.tsx                      # Landing page (hero + features)
│   └── globals.css                   # Tailwind + Naruto theme CSS variables
├── components/
│   ├── ui/                           # shadcn/ui primitives (13 components)
│   ├── dashboard-header.tsx          # Nav bar: logo, links, theme toggle, user menu
│   ├── expense-form.tsx              # Add expense dialog with limit warnings
│   ├── expense-list.tsx              # Filterable, paginated expense table
│   ├── chakra-bar-chart.tsx          # Recharts bar chart (category spending)
│   ├── spending-limit-progress.tsx   # Progress bars for daily/monthly/yearly limits
│   ├── rasengan-loader.tsx           # Animated Naruto-themed loading spinner
│   └── theme-provider.tsx            # React context for light/dark theme
├── lib/
│   ├── db/
│   │   ├── schema/
│   │   │   ├── index.ts              # Barrel export for all schemas
│   │   │   ├── users.ts              # users table (id, email, name, timestamps)
│   │   │   ├── expenses.ts           # expenses table + categories enum + relations
│   │   │   └── user-limits.ts        # user_limits table (daily/monthly/yearly cents)
│   │   ├── index.ts                  # Drizzle client factory (postgres-js)
│   │   └── actions.ts                # Server Actions: all CRUD operations (~380 lines)
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   └── server.ts                 # Server Supabase client (cookie-based)
│   ├── utils/
│   │   └── expenses.ts               # Category icons, currency/date formatters
│   └── toast.tsx                     # Naruto-themed toast helpers (missionComplete, etc.)
├── drizzle/                          # Generated migration SQL files
├── middleware.ts                     # Auth route protection (redirects)
├── drizzle.config.ts                 # Drizzle ORM configuration
├── components.json                   # shadcn/ui configuration
├── .env.local                        # Environment variables (Supabase creds)
└── .github/ISSUE_TEMPLATE/           # Bug report + feature request templates
```

## Database Schema

### Tables (Drizzle ORM)

**users** - User profiles linked to Supabase Auth
- `id` (uuid, PK, auto-generated)
- `email` (text, unique, not null)
- `name` (text, nullable)
- `created_at`, `updated_at` (timestamps)

**expenses** - Expense records
- `id` (uuid, PK, auto-generated)
- `amount` (integer, cents - e.g., 1299 = $12.99)
- `category` (text enum: Food, Transport, Shopping, Bills, Entertainment, Health, Other)
- `description` (text, nullable)
- `date` (date, defaults to now)
- `user_id` (uuid, FK → users.id, cascade delete)
- `created_at`, `updated_at` (timestamps)

**user_limits** - Spending limit configuration per user
- `id` (uuid, PK, auto-generated)
- `user_id` (uuid, FK → users.id, cascade delete)
- `daily_limit_cents` (integer, nullable)
- `monthly_limit_cents` (integer, nullable)
- `yearly_limit_cents` (integer, nullable)
- `updated_at` (timestamp)

### Key Relationships
- Each user has many expenses (one-to-many, cascade delete)
- Each user has one user_limits record (one-to-many, cascade delete)
- Expenses reference users via `user_id` foreign key

## Server Actions (lib/db/actions.ts)

All database operations are implemented as Next.js Server Actions (`"use server"`):

### User Operations
- `getCurrentUserId()` - Gets current user from Supabase session, creates profile if missing

### Expense Operations
- `getExpenses(filters)` - Paginated, filterable expense list (by date range, category)
- `addExpense(data)` - Create new expense with limit warning checks
- `updateExpense(id, data)` - Update existing expense
- `deleteExpense(id)` - Delete expense
- `exportExpensesToCSV()` - Export all expenses as CSV string

### Spending Limits
- `getUserLimits()` - Fetch current user's spending limits
- `updateUserLimits(data)` - Update daily/monthly/yearly limits
- `checkLimitWarnings(amount)` - Check if adding expense would exceed any limit

### Dashboard Stats
- `getDashboardStats()` - Monthly/yearly/all-time totals, top category, category breakdown

## Theme System

Two themes implemented via CSS custom properties in `app/globals.css`:

**Light Theme (Leaf Village)** - `[data-theme="light"]`
- Background: warm off-white (oklch 0.98)
- Primary: Naruto orange (oklch 0.65, hue 45)
- Chart colors: Fire (orange), Wind (cyan), Lightning (purple), Earth (yellow), Water (green)

**Dark Theme (Akatsuki)** - `[data-theme="dark"]`
- Background: dark blue-black (oklch 0.12)
- Primary: Akatsuki red (oklch 0.60, hue 25)
- Chart colors: adjusted for dark mode

Theme is managed by `ThemeProvider` component + `useTheme` hook, persisted in `localStorage` as `naruto-theme`.

## Authentication Flow

1. **Signup**: Email + password → Supabase Auth → email verification
2. **Login**: Email + password → Supabase Auth → session → redirect to /dashboard
3. **Password Reset**: Email → Supabase sends OTP → user verifies OTP → sets new password
4. **Route Protection**: `middleware.ts` checks session on every request
   - Unauthenticated → redirect /dashboard/* to /login
   - Authenticated → redirect /login, /signup to /dashboard

## Building and Running

### Prerequisites
- Node.js 20+
- pnpm
- Supabase project (free tier works)

### Development
```bash
pnpm dev                    # Start dev server with Turbopack (localhost:3000)
```

### Production Build
```bash
pnpm build                  # TypeScript check + production build
pnpm start                  # Run production server
```

### Database Migrations
```bash
pnpm drizzle-kit push       # Push schema changes to database (with confirmation)
pnpm drizzle-kit push --force # Push without confirmation
pnpm drizzle-kit generate   # Generate migration SQL files from schema changes
```

### Linting
```bash
pnpm lint                   # Run ESLint
```

### Environment Variables
Required in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anon/public key
DATABASE_URL=                       # PostgreSQL connection string (pooler port 6543)
SUPABASE_DB_URL=                    # Same as DATABASE_URL (legacy compatibility)
```

## Coding Conventions

### TypeScript
- Strict mode enabled (`"strict": true`)
- All files are `.ts` or `.tsx` (no JS)
- Type imports use `import type` syntax
- No implicit `any`

### React Components
- Functional components with hooks
- Client components marked with `"use client"` directive
- Server components by default (no directive)
- Props defined with TypeScript interfaces or inline types

### Server Actions
- All database mutations in `lib/db/actions.ts`
- Marked with `"use server"` directive
- Always validate user authentication before operations
- Use `revalidatePath()` after mutations to refresh UI
- Return meaningful error messages

### Styling
- Tailwind CSS utility classes preferred
- Custom CSS classes defined in `globals.css`: `.naruto-card`, `.naruto-button`, `.naruto-input`, `.jutsu-release`
- Both themes must be supported (use CSS variables, not hardcoded colors)
- Responsive design: mobile-first, then `sm:`, `md:`, `lg:` breakpoints

### Naming
- Components: PascalCase (`ExpenseForm`, `ChakraBarChart`)
- Files: kebab-case (`expense-form.tsx`, `chakra-bar-chart.tsx`)
- Functions/variables: camelCase
- Database columns: snake_case (via Drizzle)

### Error Handling
- Use try/catch in Server Actions
- Show toasts via `lib/toast.tsx` helpers: `missionComplete()`, `missionFailed()`, `jutsuWarning()`
- Never expose raw database errors to UI

## Key Design Patterns

1. **Server Actions for Mutations**: All database writes go through Server Actions, not API routes
2. **Client Components for Interactivity**: Forms, dialogs, charts are client components
3. **Server Components for Data Fetching**: Dashboard page is server component that calls Server Actions
4. **Optimistic UI with revalidatePath**: After mutations, paths are revalidated to refresh data
5. **Theme Context**: Global theme state via React Context + localStorage persistence
6. **Filter State in URL/Component State**: Expense filters use component state, pagination tracked locally

## Common Tasks

### Add a new database table
1. Create schema file in `lib/db/schema/`
2. Export from `lib/db/schema/index.ts`
3. Run `pnpm drizzle-kit generate` to create migration
4. Run `pnpm drizzle-kit push --force` to apply migration

### Add a new page
1. Create directory under `app/` (e.g., `app/dashboard/reports/`)
2. Create `page.tsx` (server component by default)
3. Add `"use client"` if using hooks/state
4. Add navigation link in `components/dashboard-header.tsx`

### Add a new Server Action
1. Add function to `lib/db/actions.ts`
2. Mark with `"use server"` at top of file
3. Always call `getCurrentUserId()` first for auth check
4. Use Drizzle queries for database operations
5. Call `revalidatePath()` after writes

### Customize theme
1. Edit CSS variables in `app/globals.css` under `[data-theme="light"]` or `[data-theme="dark"]`
2. Add new custom CSS classes in `@layer components` section
3. Use in components via `className`

## Dependencies

### Core Runtime (21 packages)
- `next`, `react`, `react-dom` - Framework
- `drizzle-orm`, `postgres` - Database
- `@supabase/ssr`, `@supabase/supabase-js` - Auth
- `tailwindcss`, `@tailwindcss/postcss` - Styling
- `recharts` - Charts
- `sonner` - Toast notifications
- `lucide-react`, `@hugeicons/react` - Icons
- `shadcn`, `radix-ui`, `class-variance-authority` - UI components
- `date-fns` - Date formatting
- `zod` - Validation (installed, not yet used extensively)
- `clsx`, `tailwind-merge` - Class name utilities

### Dev Dependencies (6 packages)
- `typescript` - Type checking
- `drizzle-kit` - Migration tooling
- `eslint`, `eslint-config-next` - Linting
- `@types/node`, `@types/react`, `@types/react-dom` - Type definitions

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import repo in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy (automatic on push to main)

### Notes
- `.env.local` is gitignored - must set env vars in hosting platform
- Database migrations must be run manually after deployment
- Supabase handles database hosting, no need for separate DB server

## Open Source

- **License**: MIT
- **Contributing**: See `CONTRIBUTING.md`
- **Issues**: GitHub templates for bugs and feature requests in `.github/ISSUE_TEMPLATE/`
- **Conventional Commits**: Recommended (`feat:`, `fix:`, `docs:`, `refactor:`, etc.)
