"use client";

import { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "@/lib/db/actions";
import type { Expense, ExpenseCategory } from "@/lib/db/schema/expenses";
import { formatCurrency, formatDate, categoryIcons } from "@/lib/utils/expenses";
import { RasenganLoader } from "@/components/rasengan-loader";
import { Button } from "@/components/ui/button";
import { Trash2, Filter, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { toast, missionComplete, missionFailed } from "@/lib/toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/db/schema/expenses";

export function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("30");

  useEffect(() => {
    async function loadExpenses() {
      setLoading(true);
      try {
        const now = new Date();
        let startDate: string | undefined;

        if (dateFilter === "7") {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        } else if (dateFilter === "30") {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        }

        const result = await getExpenses({
          startDate,
          category: categoryFilter !== "all" ? (categoryFilter as ExpenseCategory) : undefined,
          page,
          limit: 8,
        });

        setExpenses(result.expenses);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Failed to load expenses:", error);
      } finally {
        setLoading(false);
      }
    }

    loadExpenses();
  }, [page, categoryFilter, dateFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to release this jutsu (delete expense)?")) return;

    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      missionComplete("The record has been burned.");
    } catch (error) {
      missionFailed("Deletion jutsu failed.");
    }
  };

  if (loading && expenses.length === 0) return <RasenganLoader />;

  return (
    <div className="space-y-6">
      {/* Enhanced Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-xl border-2 border-dashed border-primary/20">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-xs font-black uppercase tracking-widest text-primary/60">Filter Scroll</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-[160px] font-bold border-2">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Sunsets</SelectItem>
              <SelectItem value="30">Last Moon Cycle</SelectItem>
              <SelectItem value="all">Eternal History</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px] font-bold border-2">
              <SelectValue placeholder="Chakra Nature" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-bold italic">All Natures</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="font-bold">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {expenses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 border-2 border-dashed rounded-2xl bg-muted/5"
          >
            <div className="text-7xl mb-6 grayscale opacity-20">🍃</div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
              The scroll is <span className="text-primary italic">empty</span>
            </h3>
            <p className="text-muted-foreground font-medium max-w-xs mx-auto">
              No missions found for these parameters. Add a new expense to begin your training.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-hidden rounded-2xl border-2 border-primary/10 bg-card/30 backdrop-blur-sm shadow-xl"
          >
            <Table>
              <TableHeader className="bg-primary/5">
                <TableRow className="hover:bg-transparent border-primary/10">
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-primary py-4">Date</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-primary py-4">Nature</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-primary py-4">Mission Intel</TableHead>
                  <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-primary py-4">Amount</TableHead>
                  <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-primary py-4">Release</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense, i) => {
                  const IconComponent = categoryIcons[expense.category as ExpenseCategory] || Search;
                  return (
                    <motion.tr 
                      key={expense.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group border-primary/5 hover:bg-primary/5 transition-colors"
                    >
                      <TableCell className="font-bold py-4">{formatDate(expense.date)}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <span className="font-black uppercase tracking-tighter text-sm">{expense.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate font-medium text-muted-foreground py-4">
                        {expense.description || "—"}
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <span className="text-lg font-black tracking-tighter">{formatCurrency(expense.amount)}</span>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(expense.id)}
                          className="text-destructive/40 hover:text-destructive hover:bg-destructive/10 transition-all rounded-full h-10 w-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shinobi Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Scroll {page} <span className="text-primary">/</span> {totalPages}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 border-2 font-bold hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 border-2 font-bold hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
