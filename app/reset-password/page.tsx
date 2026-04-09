"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { RasenganLoader } from "@/components/rasengan-loader";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"otp" | "password">("otp");

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: "", // Supabase will use the session from the email link
        token: otp,
        type: "email",
      });

      if (error) throw error;

      setStep("password");
      toast({
        title: "✓ OTP Verified",
        description: "Now set your new password.",
        type: "success",
      });
    } catch (error: any) {
      toast({
        title: "❌ Invalid OTP",
        description: error.message || "Please check your OTP and try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: "❌ Passwords Don't Match",
        description: "Please make sure your passwords match.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "🎉 Password Updated!",
        description: "Your password has been successfully reset.",
        type: "success",
      });

      router.push("/login");
    } catch (error: any) {
      toast({
        title: "❌ Reset Failed",
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🍥 Naruto Finance</h1>
          <p className="text-muted-foreground">
            {step === "otp" ? "Enter your OTP" : "Set new password"}
          </p>
        </div>

        <div className="naruto-card p-6">
          {step === "otp" ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Verify OTP</h2>
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium mb-2">
                    6-Digit OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="naruto-input w-full"
                    placeholder="123456"
                    maxLength={6}
                    required
                  />
                </div>

                <button type="submit" className="naruto-button w-full">
                  Verify OTP
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">New Password</h2>
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium mb-2"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                  Reset Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
