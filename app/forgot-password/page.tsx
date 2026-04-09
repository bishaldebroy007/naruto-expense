"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { toast } from "@/lib/toast";
import { RasenganLoader } from "@/components/rasengan-loader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "📨 Check Your Email",
        description: "We've sent you a password reset OTP.",
        type: "success",
      });
    } catch (error: any) {
      toast({
        title: "❌ Request Failed",
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

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="naruto-card p-6 text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
            <p className="text-muted-foreground mb-6">
              We&apos;ve sent a 6-digit OTP to your email. Enter it to reset your
              password.
            </p>
            <Link href="/reset-password" className="naruto-button inline-block">
              Enter OTP
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🍥 Naruto Finance</h1>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        <div className="naruto-card p-6">
          <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
          <form onSubmit={handleResetRequest} className="space-y-4">
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

            <button type="submit" className="naruto-button w-full">
              Send OTP
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
