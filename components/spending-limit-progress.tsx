"use client";

import { useEffect, useState } from "react";
import { getExpenses } from "@/lib/db/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils/expenses";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Zap } from "lucide-react";

interface SpendingLimitProgressProps {
  limits: {
    dailyLimitCents: number | null;
    monthlyLimitCents: number | null;
    yearlyLimitCents: number | null;
  };
}

export function SpendingLimitProgress({ limits }: SpendingLimitProgressProps) {
  const [dailySpent, setDailySpent] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [yearlySpent, setYearlySpent] = useState(0);

  useEffect(() => {
    async function loadSpending() {
      const today = new Date().toISOString().split("T")[0];
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];

      const [dailyData, monthlyData, yearlyData] = await Promise.all([
        getExpenses({ startDate: today, endDate: today, limit: 1000 }),
        getExpenses({ startDate: firstDayOfMonth.toISOString().split("T")[0], limit: 1000 }),
        getExpenses({ startDate: firstDayOfYear, limit: 1000 }),
      ]);

      setDailySpent(dailyData.expenses.reduce((sum, exp) => sum + exp.amount, 0));
      setMonthlySpent(monthlyData.expenses.reduce((sum, exp) => sum + exp.amount, 0));
      setYearlySpent(yearlyData.expenses.reduce((sum, exp) => sum + exp.amount, 0));
    }

    loadSpending();
  }, []);

  const calculatePercent = (spent: number, limit: number | null) => 
    limit ? Math.min((spent / limit) * 100, 100) : 0;

  const renderLimit = (label: string, spent: number, limit: number | null, icon: any) => {
    if (!limit) return null;
    const percent = calculatePercent(spent, limit);
    const isExceeded = spent > limit;
    const Icon = icon;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${isExceeded ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">{label}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-sm font-black tracking-tighter ${isExceeded ? "text-destructive" : "text-foreground"}`}>
              {formatCurrency(spent)} <span className="text-muted-foreground font-medium">/ {formatCurrency(limit)}</span>
            </span>
            {isExceeded && (
              <motion.span 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-bold text-destructive uppercase tracking-widest"
              >
                Seal Breached!
              </motion.span>
            )}
          </div>
        </div>
        <div className="relative h-3 w-full bg-muted/50 rounded-full overflow-hidden border border-border/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`absolute top-0 left-0 h-full rounded-full ${
              isExceeded 
                ? "bg-gradient-to-r from-destructive to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                : "bg-gradient-to-r from-primary to-orange-300 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
            }`}
          />
        </div>
      </div>
    );
  };

  const hasAnyLimit = limits.dailyLimitCents || limits.monthlyLimitCents || limits.yearlyLimitCents;

  return (
    <Card className="naruto-card border-none bg-card/40 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-30" />
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          Budget <span className="text-primary italic">Seals</span>
          {hasAnyLimit && (
            <div className="ml-auto">
              <Zap className="h-5 w-5 text-primary animate-pulse" />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {hasAnyLimit ? (
          <>
            {renderLimit("Daily Chakra", dailySpent, limits.dailyLimitCents, ShieldCheck)}
            {renderLimit("Monthly Flow", monthlySpent, limits.monthlyLimitCents, ShieldAlert)}
            {renderLimit("Yearly Path", yearlySpent, limits.yearlyLimitCents, Zap)}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-4 grayscale opacity-20">📜</div>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
              No seals active. Visit configuration to set limits.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
