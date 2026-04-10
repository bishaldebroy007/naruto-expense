"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, missionComplete, missionFailed } from "@/lib/toast";
import { RasenganLoader } from "@/components/rasengan-loader";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Zap } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      missionComplete("Welcome back to the village, Shinobi!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      missionFailed(error.message || "Access denied. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <RasenganLoader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] select-none grayscale">🍥</div>
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
          <h1 className="text-4xl font-black tracking-tighter uppercase">
            NARUTO <span className="text-primary italic">FINANCE</span>
          </h1>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.3em] mt-2 opacity-60">
            Secure Mission Terminal
          </p>
        </div>

        <div className="naruto-card p-10 bg-card/60 backdrop-blur-xl border-2 border-primary/10">
          <div className="flex items-center gap-2 mb-8">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Identify <span className="text-primary italic">Self</span></h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="font-black uppercase tracking-widest text-[10px] text-primary">Email Scroll</Label>
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
              <Label className="font-black uppercase tracking-widest text-[10px] text-primary">Security Seal</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-2 font-bold focus:ring-primary/20"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
              >
                Lost your scroll?
              </Link>
            </div>

            <Button type="submit" className="naruto-button w-full h-14 text-lg group">
              <Zap className="h-5 w-5 mr-2 group-hover:animate-pulse" />
              ENTER VILLAGE
            </Button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-border/50">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">New Recruit? </span>
            <Link href="/signup" className="text-primary hover:underline font-black uppercase tracking-widest text-xs">
              Join the Academy
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
