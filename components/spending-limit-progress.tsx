"use client";

import { useEffect, useState } from "react";
import { getExpenses } from "@/lib/db/actions";
import type { ExpenseCategory } from "@/lib/db/schema/expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils/expenses";

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
      const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];

      const [dailyData, monthlyData, yearlyData] = await Promise.all([
        getExpenses({ startDate: today, endDate: today, limit: 1000 }),
        getExpenses({
          startDate: firstDayOfMonth.toISOString().split("T")[0],
          limit: 1000,
        }),
        getExpenses({ startDate: firstDayOfYear, limit: 1000 }),
      ]);

      setDailySpent(
        dailyData.expenses.reduce((sum, exp) => sum + exp.amount, 0)
      );
      setMonthlySpent(
        monthlyData.expenses.reduce((sum, exp) => sum + exp.amount, 0)
      );
      setYearlySpent(
        yearlyData.expenses.reduce((sum, exp) => sum + exp.amount, 0)
      );
    }

    loadSpending();
  }, []);

  const dailyPercent = limits.dailyLimitCents
    ? Math.min((dailySpent / limits.dailyLimitCents) * 100, 100)
    : 0;
  const monthlyPercent = limits.monthlyLimitCents
    ? Math.min((monthlySpent / limits.monthlyLimitCents) * 100, 100)
    : 0;
  const yearlyPercent = limits.yearlyLimitCents
    ? Math.min((yearlySpent / limits.yearlyLimitCents) * 100, 100)
    : 0;

  const isDailyExceeded = limits.dailyLimitCents && dailySpent > limits.dailyLimitCents;
  const isMonthlyExceeded = limits.monthlyLimitCents && monthlySpent > limits.monthlyLimitCents;
  const isYearlyExceeded = limits.yearlyLimitCents && yearlySpent > limits.yearlyLimitCents;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Limits Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {limits.dailyLimitCents && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Daily Limit</span>
              <span className={isDailyExceeded ? "text-red-500 font-semibold" : ""}>
                {formatCurrency(dailySpent)} / {formatCurrency(limits.dailyLimitCents)}
                {isDailyExceeded && " ⚠️"}
              </span>
            </div>
            <Progress
              value={dailyPercent}
              className={isDailyExceeded ? "bg-red-200 [&>div]:bg-red-500" : ""}
            />
          </div>
        )}

        {limits.monthlyLimitCents && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Monthly Limit</span>
              <span className={isMonthlyExceeded ? "text-red-500 font-semibold" : ""}>
                {formatCurrency(monthlySpent)} / {formatCurrency(limits.monthlyLimitCents)}
                {isMonthlyExceeded && " ⚠️"}
              </span>
            </div>
            <Progress
              value={monthlyPercent}
              className={isMonthlyExceeded ? "bg-red-200 [&>div]:bg-red-500" : ""}
            />
          </div>
        )}

        {limits.yearlyLimitCents && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Yearly Limit</span>
              <span className={isYearlyExceeded ? "text-red-500 font-semibold" : ""}>
                {formatCurrency(yearlySpent)} / {formatCurrency(limits.yearlyLimitCents)}
                {isYearlyExceeded && " ⚠️"}
              </span>
            </div>
            <Progress
              value={yearlyPercent}
              className={isYearlyExceeded ? "bg-red-200 [&>div]:bg-red-500" : ""}
            />
          </div>
        )}

        {!limits.dailyLimitCents && !limits.monthlyLimitCents && !limits.yearlyLimitCents && (
          <p className="text-center text-muted-foreground py-4">
            No spending limits set. Visit Settings to configure your budget limits.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
