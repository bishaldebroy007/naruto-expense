"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-destructive/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-2"
        >
          <span className="text-3xl">🍥</span>
          <span className="text-xl font-bold tracking-tighter">NARUTO FINANCE</span>
        </motion.div>
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex gap-4"
        >
          <Link href="/login">
            <Button variant="ghost" className="font-semibold">Login</Button>
          </Link>
          <Link href="/signup">
            <Button className="naruto-button">Join Village</Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-6 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-block bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 text-primary text-sm font-bold tracking-widest uppercase"
        >
          S-Rank Finance Tracking
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none"
        >
          MASTER YOUR <br />
          <span className="text-primary italic">FINANCIAL CHAKRA</span>
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12"
        >
          Stop losing track of your ryo. Log expenses, set mission budgets, 
          and watch your financial power grow with ninja precision.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/signup">
            <Button size="lg" className="naruto-button h-14 px-10 text-lg">
              Start Your Journey
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-2 hover:bg-muted transition-colors">
              Enter Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Floating Icons Animation */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 1000 - 500, 
                y: Math.random() * 1000 - 500,
                opacity: 0 
              }}
              animate={{ 
                x: [null, Math.random() * 20 - 10, Math.random() * 20 - 10],
                y: [null, Math.random() * 20 - 10, Math.random() * 20 - 10],
                opacity: [0, 0.4, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity,
                delay: i * 0.5 
              }}
              className="absolute text-4xl"
              style={{ 
                left: `${15 + i * 15}%`, 
                top: `${20 + (i % 3) * 25}%` 
              }}
            >
              {['🍥', '🗡️', '🍜', '🍃', '🔥', '📜'][i]}
            </motion.div>
          ))}
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-40">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: "🥷", 
              title: "Ninja Precision", 
              desc: "Instant logging of every ryo spent on missions and ramen." 
            },
            { 
              icon: "📊", 
              title: "Chakra Analysis", 
              desc: "Visual breakdowns of your spending nature with beautiful charts." 
            },
            { 
              icon: "🎯", 
              title: "Budget Seal", 
              desc: "Set strict limits that keep your finances from going out of control." 
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="naruto-card p-8 group"
            >
              <div className="text-5xl mb-6 group-hover:scale-125 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative z-10 py-24 bg-primary/5 border-y border-primary/10">
        <div className="max-w-4xl mx-auto px-6 text-center italic">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl md:text-4xl font-medium mb-6 leading-tight"
          >
            "It's not about how much you earn, it's about your ninja way of managing it."
          </motion.p>
          <p className="text-primary font-bold tracking-widest uppercase">— THE FINANCIAL HOKAGE</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            <span className="text-2xl">🍥</span>
            <span className="font-bold tracking-tighter">NARUTO FINANCE</span>
          </div>
          <div className="text-muted-foreground text-sm">
            © 2026 BELIEVE IT. OPEN SOURCE MIT.
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Scroll of Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Village Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
