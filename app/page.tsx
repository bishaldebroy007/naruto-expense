import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-8xl mb-6">🍥</div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Naruto Finance
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
            Track your expenses like a true ninja
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🥷</div>
            <h3 className="text-xl font-bold mb-2">Expense Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Log and categorize your expenses with ninja precision.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Budget Limits</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Set daily, monthly, and yearly spending limits with chakra-powered alerts.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🍜</div>
            <h3 className="text-xl font-bold mb-2">Ninja Theme</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Beautiful Leaf Village and Akatsuki themes to match your ninja spirit.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Master Your Finances?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of ninjas who trust Naruto Finance to track their spending.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-12">
              Start Your Ninja Journey
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 Naruto Finance. Open Source under MIT License.</p>
          <p className="mt-2">Built with Next.js, Supabase, and Drizzle ORM</p>
        </div>
      </footer>
    </div>
  );
}
