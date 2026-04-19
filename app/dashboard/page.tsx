"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, getUserLimits } from "@/lib/db/actions";
import { formatCurrency } from "@/lib/utils/expenses";
import { RasenganLoader } from "@/components/rasengan-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet, Target, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportExpensesToCSV } from "@/lib/db/actions";
import { toast } from "@/lib/toast";
import { ChakraBarChart } from "@/components/chakra-bar-chart";
import { ExpenseList } from "@/components/expense-list";
import { ExpenseForm } from "@/components/expense-form";
import { SpendingLimitProgress } from "@/components/spending-limit-progress";
import { motion, AnimatePresence } from "framer-motion";
import { PiScrollFill } from "react-icons/pi";
// import { GiCrossedSabres } from "react-icons/gi";
// import { AiOutlineFileDone } from "react-icons/ai";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

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
        title: "Mission Complete!",
        description: "Your expenses have been exported to CSV.",
        type: "success",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export expenses. Please try again.",
        type: "error",
      });
    }
  };

  if (loading) {
    return <RasenganLoader />;
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Page Title */}
      <motion.div
        variants={item}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
            Shinobi <span className="text-primary italic">Ledger</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Monitor your resource flow and mission costs.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="h-11 px-6 border-2 font-bold hover:bg-muted"
          >
            <Download className="h-4 w-4 mr-2" />
            Scroll Export
          </Button>
          <ExpenseForm />
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        variants={item}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {[
          {
            label: "Monthly Flow",
            value: stats?.monthlySpent,
            icon: Calendar,
            sub: "Current Moon",
          },
          {
            label: "Yearly Path",
            value: stats?.yearlySpent,
            icon: TrendingUp,
            sub: "Full Cycle",
          },
          {
            label: "Total Ryo",
            value: stats?.allTimeSpent,
            icon: Wallet,
            sub: "Lifetime",
          },
          {
            label: "Primary Nature",
            value: stats?.topCategory || "N/A",
            icon: Target,
            sub: "Top Cost",
            isCurrency: false,
          },
        ].map((card, idx) => (
          <Card
            key={idx}
            className="naruto-card border-none bg-card/40 hover:bg-card/60"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black">
                {card.isCurrency !== false
                  ? formatCurrency(card.value || 0)
                  : card.value}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-tighter text-primary/60 mt-1">
                {card.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Spending Limit Progress */}
      <AnimatePresence>
        {limits &&
          (limits.dailyLimitCents ||
            limits.monthlyLimitCents ||
            limits.yearlyLimitCents) && (
            <motion.div
              variants={item}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <SpendingLimitProgress limits={limits} />
            </motion.div>
          )}
      </AnimatePresence>

      {/* Chart and Quick Add */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="naruto-card border-none bg-card/40 h-full">
            <CardHeader>
              <CardTitle className="text-xl font-black uppercase tracking-tight">
                Chakra <span className="text-primary">Composition</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.categoryBreakdown &&
              stats.categoryBreakdown.length > 0 ? (
                <div className="h-87.5 w-full">
                  <ChakraBarChart data={stats.categoryBreakdown} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-75 text-muted-foreground gap-4">
                  <div className="text-6xl grayscale opacity-20">
                    <PiScrollFill color="yellow" />
                  </div>
                  <p className="font-medium">
                    No spending nature detected this month
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="naruto-card border-none bg-primary/5 h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-6xl opacity-10 group-hover:scale-125 transition-transform duration-700">
              🍜
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-black uppercase tracking-tight">
                Quick <span className="text-primary">Seal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseForm compact />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Expense List */}
      <motion.div variants={item}>
        <Card className="naruto-card border-none bg-card/40 overflow-visible">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black uppercase tracking-tight">
              Mission <span className="text-primary">Logs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseList />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
