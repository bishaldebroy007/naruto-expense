# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Naruto Finance seriously. If you discover a security vulnerability, please follow these steps:

### **DO NOT** open a public issue for security vulnerabilities

1. **Email us directly** at [YOUR_SECURITY_EMAIL_HERE] with:
   - A description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fixes (optional)

2. **Expected response time**: We will acknowledge your report within 48 hours and provide a detailed response within 5 business days.

3. **What to expect**:
   - We will investigate and validate the reported issue
   - We will work on a fix and keep you updated on progress
   - We will credit you in our release notes (unless you prefer to remain anonymous)
   - We will publish a security advisory once the fix is deployed

4. **Please allow**:
   - Reasonable time to fix the issue before public disclosure
   - Time for us to respond and engage on the issue

## Security Best Practices We Follow

- **Environment Variables**: All secrets and API keys are stored in environment variables, never in code
- **Row Level Security (RLS)**: Database-level access controls ensure users can only access their own data
- **Authentication**: Supabase Auth with secure session management via HTTP-only cookies
- **Input Validation**: All user inputs validated server-side using Zod schemas
- **SQL Injection Prevention**: Using Drizzle ORM for parameterized queries
- **No Console Logging**: Production code contains no debug logging that could leak sensitive information
- **Dependency Scanning**: Regular audits of npm dependencies for known vulnerabilities

## Database Security

This project uses Supabase PostgreSQL with Row Level Security (RLS) policies:

- `users` table: Users can only view/modify their own profile
- `expenses` table: Users can only view/modify their own expenses
- `user_limits` table: Users can only view/modify their own spending limits

All database operations are scoped to the authenticated user via `auth.uid()`.

## API Security

- All database operations go through server-side Next.js Server Actions
- Client-side Supabase client uses the anon key with RLS policies enforced
- Middleware validates authentication state on protected routes
- No direct API endpoints exposed that bypass authentication

## Known Limitations

- This is an open-source project intended for educational purposes
- Always review third-party dependencies for security updates
- Report any issues found in community packages upstream

## Recognition

We appreciate security researchers who help keep this project safe. Contributors who report valid security issues will be acknowledged in our security hall of fame (with permission).

---

**Thank you for keeping Naruto Finance secure! 🍃**
