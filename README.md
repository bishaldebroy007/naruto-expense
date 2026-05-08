# Naruto Finance

> A Naruto-themed expense tracker built with Next.js, Supabase, and Drizzle ORM.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F)

Naruto Finance is a full-stack expense tracker web application with a Naruto anime visual theme. It provides user authentication, expense CRUD operations, spending limit tracking, category-based visualizations, and CSV export. The application features two custom themes -- Leaf Village (light) and Akatsuki (dark) -- applied via a `data-theme` attribute system with localStorage persistence.

## Features

**Authentication**

- Email and password sign-up with email verification
- Login with Supabase Auth and cookie-based session management
- Forgot password flow with OTP verification
- Protected routes via Next.js middleware that syncs Supabase cookies through `@supabase/ssr`

**Expense Management**

- Create, edit, and delete expense records
- Categorize expenses into: Food, Transport, Shopping, Bills, Entertainment, Health, and Other
- Filter expenses by category and date range
- Pagination for expense lists
- All monetary amounts stored in cents internally and displayed as dollars

**Dashboard and Analytics**

- Summary cards showing total spending, income balance, and limit usage
- Bar chart visualization of spending by category using Recharts (styled as "Chakra Nature Bars")
- Spending limit progress bars for the current period (daily, monthly, or yearly)
- Warnings displayed when adding expenses that would exceed configured limits

**Spending Limits**

- Configure budget limits per category with selectable time periods (daily, monthly, yearly)
- Visual progress bars showing remaining budget
- Warning toasts (via Sonner) when an expense exceeds a configured limit

**Data Export**

- Export filtered expenses to a downloadable CSV file via a Next.js server action

**Theming**

- Leaf Village (light theme): warm off-white background with orange primary accents
- Akatsuki (dark theme): dark blue-black background with red primary accents
- Theme toggled via a header control and persisted to `localStorage` as `data-theme` on the root element
- Custom CSS variables, border styles, and component theming through Tailwind CSS

**UI/UX**

- Responsive layout that works on mobile and desktop
- Custom Rasengan animated loader
- Naruto-themed toast notifications for success and error feedback
- Category icons from Lucide React and Hugeicons

## Architecture

### Database

The application uses Supabase PostgreSQL with three tables managed by Drizzle ORM:

| Table | Description |
|-------|-------------|
| `users` | User profiles synced from Supabase Auth |
| `expenses` | Expense records with category, amount (cents), date, description, and user reference |
| `user_limits` | Per-user, per-category spending limits with period type (daily, monthly, yearly) |

Row Level Security (RLS) policies ensure users can only access their own data.

### Application Structure

```
naruto-expense/
├── app/                          # Next.js App Router pages and layouts
│   ├── (auth)/                   # Auth route group (login, signup, etc.)
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── layout.tsx            # Dashboard shell with header
│   │   ├── page.tsx              # Main dashboard view with charts
│   │   └── settings/             # Spending limits and account config
│   ├── layout.tsx                # Root layout with Toaster and providers
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Theme CSS variables and custom styles
├── components/                   # React UI components
│   ├── ui/                       # Shadcn/ui primitive components
│   ├── dashboard-header.tsx      # Top navigation with theme toggle and user menu
│   ├── expense-form.tsx          # Add/edit expense modal
│   ├── expense-list.tsx          # Paginated expense table
│   ├── chakra-bar-chart.tsx      # Category spending bar chart
│   └── spending-limit-progress.tsx
├── lib/                          # Core utilities
│   ├── db/                       # Database layer
│   │   ├── schema/               # Drizzle table definitions (users, expenses, user_limits)
│   │   ├── index.ts              # Database connection client
│   │   └── actions.ts            # Server actions for expense CRUD and limits
│   ├── supabase/                 # Supabase client factories
│   │   ├── client.ts             # Browser client (@supabase/ssr createBrowserClient)
│   │   └── server.ts             # Server client (@supabase/ssr createServerClient)
│   ├── toast.tsx                 # Naruto-themed sonner toast wrappers
│   └── utils.ts                  # General helper functions
├── middleware.ts                 # Auth route protection with cookie sync
├── drizzle.config.ts             # Drizzle Kit configuration
└── drizzle/                      # Generated migration files
```

### Key Technical Decisions

- **Supabase SSR**: The browser client uses `createBrowserClient` from `@supabase/ssr` with manual cookie serialization via `document.cookie`. This is required to work with Next.js middleware for proper session handling. The client is exported as a factory function (`createClient()`) and must be called per-operation -- it is not a singleton.

- **Drizzle ORM**: Schema definitions live in `lib/db/schema/` with the main index re-exporting all tables. Migrations are generated and applied via `drizzle-kit push`.

- **Server Actions**: Expense CRUD operations are implemented as Next.js server actions in `lib/db/actions.ts`, called from client components.

- **Theme System**: Theme is controlled via a React context provider and stored in `localStorage`. The `data-theme` attribute is set on the `<html>` element and CSS custom properties are mapped through `globals.css`.

## Prerequisites

- Node.js 20 or later
- pnpm (package manager)
- A Supabase project (free tier is sufficient)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/bishaldebroy007/naruto-expense.git
cd naruto-expense
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
DATABASE_URL=postgresql://postgres.project-id:your-password@aws-region.pooler.supabase.com:6543/postgres
```

Where to find these values in your Supabase dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`: Settings > API > Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Settings > API > Project API Keys > anon/public
- `DATABASE_URL`: Settings > Database > Connection string > use the pooled (port 6543) connection string

### 4. Push Database Schema

```bash
pnpm drizzle-kit push
```

This creates the three required tables (`users`, `expenses`, `user_limits`) with their columns, indexes, and foreign key constraints.

### 5. Start the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### 6. Create an Account

Sign up with an email and password. Check your inbox for the Supabase confirmation email, then log in to access the dashboard.

## Deployment

### Deploy to Vercel

1. Push your fork to GitHub
2. Import the repository in your [Vercel dashboard](https://vercel.com)
3. Configure the three environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
4. Deploy. Vercel will run `pnpm build` automatically.

Important: do not set the database URL to a direct connection (port 5432) -- use the Supabase pooler URL (port 6543) to avoid connection exhaustion.

### Supabase Configuration

Make sure Row Level Security (RLS) is enabled on all three tables. The schema includes policies that restrict data access so each user can only read and write their own records.

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with Turbopack |
| `pnpm build` | Production build (TypeScript check + compilation) |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm drizzle-kit push` | Push schema changes to the database |
| `pnpm drizzle-kit generate` | Generate migration files from schema changes |

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the existing code style (TypeScript strict mode, consistent naming)
4. Run `pnpm build` and `pnpm lint` to verify there are no errors
5. Commit with a clear message: `git commit -m "feat: add expense search filter"`
6. Push: `git push origin feature/your-feature-name`
7. Open a Pull Request against the `main` branch

Before submitting, make sure to:

- Test authentication flows locally
- Verify expense CRUD operations work end-to-end
- Check both light and dark themes render correctly
- Confirm the build passes (`pnpm build`) and linting is clean (`pnpm lint`)

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Bug Reports and Feature Requests

Use the GitHub Issues page to report bugs or request features.

When filing a bug, include:

- Steps to reproduce the issue
- Expected behavior vs. actual behavior
- Browser and OS information
- Screenshots if relevant

## Previews of some pages

<img width="1832" height="924" alt="image" src="https://github.com/user-attachments/assets/ff9ef6e6-ba48-420c-becb-f39db11e1305" /></br>

<img width="1862" height="929" alt="image" src="https://github.com/user-attachments/assets/22ccc969-0f14-41b7-a305-290cd91ec0e0" />



## License

MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

- Naruto -- the anime by Masashi Kishimoto, which inspired the visual theme
- Next.js -- the React application framework
- Supabase -- open source backend-as-a-service
- Drizzle ORM -- TypeScript-first ORM
- Shadcn/ui -- copy-paste UI component library
- Recharts -- React charting library
- Lucide React and Hugeicons -- icon libraries
