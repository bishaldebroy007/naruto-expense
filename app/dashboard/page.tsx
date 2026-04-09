"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, getUserLimits } from "@/lib/db/actions";
import { formatCurrency } from "@/lib/utils/expenses";
import { RasenganLoader } from "@/components/rasengan-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Wallet,
  Target,
  Calendar,
  Download,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { exportExpensesToCSV } from "@/lib/db/actions";
import { toast } from "@/lib/toast";
import { categoryColors, categoryIcons } from "@/lib/utils/expenses";
import { ChakraBarChart } from "@/components/chakra-bar-chart";
import { ExpenseList } from "@/components/expense-list";
import { ExpenseForm } from "@/components/expense-form";
import { SpendingLimitProgress } from "@/components/spending-limit-progress";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [limits, setLimits] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, limitsData] = await Promise.all([
          getDashboardStats(),
          getUserLimits(),
        ]);
        setStats(statsData);
        setLimits(limitsData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleExportCSV = async () => {
    try {
      const csv = await exportExpensesToCSV();
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "naruto-finance-expenses.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "📥 Mission Complete!",
        description: "Your expenses have been exported to CSV.",
        type: "success",
      });
    } catch (error) {
      toast({
        title: "❌ Export Failed",
        description: "Failed to export expenses. Please try again.",
        type: "error",
      });
    }
  };

  if (loading) {
    return <RasenganLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your ninja spending
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <ExpenseForm />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Spending
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.monthlySpent || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Yearly Spending
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.yearlySpent || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              All-Time Spending
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.allTimeSpent || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Category
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.topCategory || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Spending Limit Progress */}
      {limits && (limits.dailyLimitCents || limits.monthlyLimitCents || limits.yearlyLimitCents) && (
        <SpendingLimitProgress limits={limits} />
      )}

      {/* Chart and Recent Expenses */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Chakra Nature Bars - Monthly Spending</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
              <ChakraBarChart data={stats.categoryBreakdown} />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No spending data this month
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Add Expense */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Add Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseForm compact />
          </CardContent>
        </Card>
      </div>

      {/* Expense List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseList />
        </CardContent>
      </Card>
    </div>
  );
}
