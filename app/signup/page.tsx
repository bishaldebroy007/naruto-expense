"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { missionComplete, missionFailed, toast } from "@/lib/toast";
import { RasenganLoader } from "@/components/rasengan-loader";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Sparkles } from "lucide-react";

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
        title: "Chakra Mismatch",
        description: "Your security seals do not align. Try again.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      missionComplete("Academy registration successful! Check your scroll (email).");
      router.push("/login");
    } catch (error: any) {
      missionFailed(error.message || "Recruitment failed. Shadow clones detected.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <RasenganLoader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="absolute top-0 right-0 text-[30vw] select-none">🍃</div>
        <div className="absolute bottom-0 left-0 text-[30vw] select-none grayscale rotate-180">🍃</div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-block text-6xl mb-4"
          >
            🍥
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            RECRUITMENT <br />
            <span className="text-primary italic">ACADEMY</span>
          </h1>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.3em] mt-3 opacity-60">
            Begin Your Shinobi Path
          </p>
        </div>

        <div className="naruto-card p-10 bg-card/60 backdrop-blur-xl border-2 border-primary/10">
          <div className="flex items-center gap-2 mb-8">
            <UserPlus className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Create <span className="text-primary italic">Identity</span></h2>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label className="font-black uppercase tracking-widest text-[10px] text-primary">Academy Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-2 font-bold focus:ring-primary/20"
                placeholder="ninja@leafvillage.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="font-black uppercase tracking-widest text-[10px] text-primary">New Security Seal</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-2 font-bold focus:ring-primary/20"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-black uppercase tracking-widest text-[10px] text-primary">Re-Validate Seal</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 border-2 font-bold focus:ring-primary/20"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="naruto-button w-full h-14 text-lg group mt-4">
              <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
              SIGN UP
            </Button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-border/50">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Already a Shinobi? </span>
            <Link href="/login" className="text-primary hover:underline font-black uppercase tracking-widest text-xs">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
