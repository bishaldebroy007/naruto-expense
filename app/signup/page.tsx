"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "@/lib/toast";
import { RasenganLoader } from "@/components/rasengan-loader";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "❌ Passwords Don't Match",
        description: "Please make sure your passwords match.",
        type: "error",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "❌ Weak Password",
        description: "Password must be at least 6 characters long.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      toast({
        title: "🎉 Registration Successful!",
        description: "Check your email to verify your account.",
        type: "success",
      });

      router.push("/login");
    } catch (error: any) {
      toast({
        title: "❌ Signup Failed",
        description: error.message || "Something went wrong.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <RasenganLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🍥 Naruto Finance</h1>
          <p className="text-muted-foreground">Begin your ninja expense tracking journey</p>
        </div>

        {/* Signup Form */}
        <div className="naruto-card p-6">
          <h2 className="text-2xl font-bold mb-6">Create Account</h2>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="naruto-input w-full"
                placeholder="ninja@leafvillage.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="naruto-input w-full"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="naruto-input w-full"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="naruto-button w-full">
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
