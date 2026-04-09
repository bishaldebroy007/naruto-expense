# Contributing to Naruto Finance

🥷 **Welcome, young ninja!** Thank you for your interest in contributing to Naruto Finance. We're excited to have you join our mission to build the best ninja-themed expense tracker!

## 📜 Code of Conduct

By participating in this project, you agree to abide by our mission to create a welcoming, respectful, and collaborative environment for all contributors.

## 🚀 How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)

**Example:**
```
**Bug**: Expense form doesn't validate negative amounts
**Steps to Reproduce**:
1. Go to Dashboard
2. Click 'Add Expense'
3. Enter -50 in amount field
4. Submit

**Expected**: Error message shown
**Actual**: Form submits successfully
```

### Suggesting Features

Feature suggestions should be:
- **Clear and specific** - Describe exactly what you want
- **Well-motivated** - Explain why this feature would be useful
- **Thoughtful** - Consider how it fits with the project's goals

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Test thoroughly** - ensure your changes work as expected
5. **Commit** with a clear message:
   ```bash
   git commit -m "feat: add expense category filtering"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** against the `main` branch

## 💻 Coding Standards

### General Guidelines

- **TypeScript**: All code must be in TypeScript with strict mode enabled
- **ESLint**: Follow the project's ESLint configuration
- **Prettier**: Code should be formatted consistently
- **Components**: Use functional components with React hooks
- **Naming**: Use descriptive, camelCase names for variables and functions

### File Organization

```
components/
  ├── ui/              # Reusable UI components
  └── [feature].tsx    # Feature-specific components

lib/
  ├── db/
  │   ├── schema/      # Database table definitions
  │   └── actions.ts   # Server actions / CRUD operations
  └── utils/           # Helper functions
```

### Component Structure

```tsx
"use client";

import { useState } from "react";
// ... other imports

interface ComponentProps {
  // Define props
}

export function ComponentName({ prop }: ComponentProps) {
  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    // Side effects
  }, []);

  // Handlers
  const handler = () => {
    // Logic
  };

  // Render
  return <div>...</div>;
}
```

### Database Operations

- All database operations should be in `lib/db/actions.ts`
- Use server actions (`"use server"`) for mutations
- Always check user authentication before operations
- Handle errors gracefully and return meaningful messages

### Styling

- Use Tailwind CSS utility classes
- Follow the Naruto theme colors defined in `app/globals.css`
- Use the custom CSS classes: `.naruto-card`, `.naruto-button`, `.naruto-input`
- Ensure components work in both light and dark themes

## 🧪 Testing

Before submitting a PR:

1. **Run the linter**:
   ```bash
   pnpm lint
   ```

2. **Test the application locally**:
   ```bash
   pnpm dev
   ```

3. **Verify your changes** work in:
   - Both light and dark themes
   - Mobile and desktop views
   - Different browsers if possible

## 📝 Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type: description

[optional body]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic changes)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat: add expense category filtering
fix: resolve date parsing in expense list
docs: update README with deployment instructions
style: format components with prettier
refactor: extract database queries to actions
```

## 🎯 Good First Issues

New to the project? Look for issues labeled `good first issue`. These are perfect for first-time contributors and help you get familiar with the codebase.

## 💬 Getting Help

- **Questions?** Open a GitHub Discussion
- **Stuck on something?** Ask in the issue you're working on
- **Need clarification?** Tag a maintainer in the issue

## 🙏 Thank You

Every contribution, no matter how small, helps make Naruto Finance better for everyone. We appreciate your time and effort!

**Remember**: "I'm not gonna run away, I never go back on my word! That's my nindō: my ninja way!" - Naruto Uzumaki 🍥

---

*Happy coding, ninja! 🥷✨*
