# 🍥 Naruto Finance

> Track your expenses like a true ninja!

![Naruto Finance](https://img.shields.io/badge/version-1.0.0-orange.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F)

**Naruto Finance** is a beautiful, open-source expense tracker web app with a Naruto anime theme. Built with modern web technologies, it helps you track your spending like a true ninja from the Leaf Village.

![Dashboard Preview](https://via.placeholder.com/1200x600/F97316/FFFFFF?text=Naruto+Finance+Dashboard)

## ✨ Features

- 🔐 **Secure Authentication** - Email/password login with Supabase Auth
- 💰 **Expense Management** - Add, edit, delete, and categorize your expenses
- 📊 **Visual Dashboard** - Beautiful charts showing spending by category (Chakra Nature Bars)
- 🎯 **Spending Limits** - Set daily, monthly, and yearly budget limits with alerts
- 🍜 **Naruto Theme** - Switch between Leaf Village (Light) and Akatsuki (Dark) themes
- 📥 **CSV Export** - Export all your expenses to a CSV file
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Fast & Modern** - Built with Next.js 16 App Router

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Row Level Security)
- **ORM**: Drizzle ORM
- **UI Components**: Shadcn/ui (customized with Naruto theme)
- **Charts**: Recharts
- **Icons**: Lucide React + Hugeicons

## 📦 Installation

### Prerequisites

- Node.js 20+ and pnpm
- A Supabase account and project ([Create one for free](https://supabase.com))

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/naruto-finance.git
cd naruto-finance
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_supabase_database_url
```

You can find these values in your Supabase project settings:
- `NEXT_PUBLIC_SUPABASE_URL`: Project URL from Settings > API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon/Public key from Settings > API
- `DATABASE_URL`: Database connection string from Settings > Database > Connection string

### 4. Run Database Migrations

```bash
pnpm drizzle-kit push
```

This will create the necessary tables in your Supabase database:
- `users` - User profiles
- `expenses` - Expense records
- `user_limits` - Spending limits

### 5. Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## 🌐 Deployment

### Deploy to Vercel

The easiest way to deploy Naruto Finance is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Add the environment variables in Vercel project settings
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/naruto-finance)

## 📁 Project Structure

```
naruto-finance/
├── app/                      # Next.js App Router
│   ├── dashboard/           # Dashboard pages
│   │   ├── layout.tsx       # Dashboard layout with header
│   │   ├── page.tsx         # Main dashboard view
│   │   └── settings/        # Settings page
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── forgot-password/     # Password reset request
│   ├── reset-password/      # OTP verification & new password
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles & Naruto theme
├── components/              # React components
│   ├── ui/                  # Shadcn/ui components
│   ├── dashboard-header.tsx
│   ├── expense-form.tsx
│   ├── expense-list.tsx
│   ├── chakra-bar-chart.tsx
│   ├── spending-limit-progress.tsx
│   ├── rasengan-loader.tsx
│   └── theme-provider.tsx
├── lib/                     # Utilities & configurations
│   ├── db/                  # Database schema & actions
│   │   ├── schema/          # Drizzle table definitions
│   │   ├── index.ts         # Database client
│   │   └── actions.ts       # Server actions for CRUD
│   ├── supabase/            # Supabase client setup
│   └── utils/               # Helper functions
├── drizzle/                 # Migration files
├── middleware.ts            # Auth middleware
└── drizzle.config.ts        # Drizzle configuration
```

## 🎨 Themes

### Leaf Village (Light Theme)
- Warm off-white background
- Orange accents (Naruto's signature color)
- Clean, bright interface

### Akatsuki (Dark Theme)
- Dark blue-black background
- Red accents (Akatsuki cloud color)
- Sleek, ninja-like dark mode

Toggle between themes using the moon/sun icon in the dashboard header.

## 🤝 Contributing

We welcome contributions from the community! Whether it's fixing a bug, adding features, or improving documentation, your help is appreciated.

Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a pull request.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Follow the existing code style (TypeScript strict mode)
- Write meaningful commit messages
- Add comments to explain complex logic
- Test your changes locally before submitting PRs
- Update documentation if needed

## 🐛 Bug Reports & Feature Requests

Found a bug? Have a feature request? Please [open an issue](https://github.com/yourusername/naruto-finance/issues) on GitHub.

- **Bug Report**: Use the bug report template and include steps to reproduce
- **Feature Request**: Describe the feature and why it would be useful

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Naruto](https://www.viz.com/naruto) - The inspiration for the theme
- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components

---

**Made with 🧡 by the Naruto Finance Team**

*Believe it! 🍥*
