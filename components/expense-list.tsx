"use client";

import { useEffect, useState } from "react";
import { getExpenses, deleteExpense } from "@/lib/db/actions";
import type { Expense, ExpenseCategory } from "@/lib/db/schema/expenses";
import { formatCurrency, formatDate, categoryIcons } from "@/lib/utils/expenses";
import { RasenganLoader } from "@/components/rasengan-loader";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { toast, missionComplete } from "@/lib/toast";
import { ExpenseForm } from "./expense-form";
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
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];
        } else if (dateFilter === "30") {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];
        }

        const result = await getExpenses({
          startDate,
          category: categoryFilter !== "all" ? (categoryFilter as ExpenseCategory) : undefined,
          page,
          limit: 10,
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
    if (!confirm("Are you sure you want to release this jutsu (delete expense)?")) {
      return;
    }

    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      missionComplete("Expense has been deleted.");
    } catch (error) {
      toast({
        title: "❌ Deletion Failed",
        description: "Failed to delete expense.",
        type: "error",
      });
    }
  };

  if (loading) {
    return <RasenganLoader />;
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🥷</div>
        <h3 className="text-xl font-semibold mb-2">
          No missions (expenses) yet, young ninja.
        </h3>
        <p className="text-muted-foreground">
          Start tracking your spending by adding your first expense!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => {
              const IconComponent =
                categoryIcons[expense.category as ExpenseCategory] || categoryIcons.Other;

              return (
                <TableRow key={expense.id}>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {expense.category}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {expense.description || "-"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ExpenseForm />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(expense.id)}
                        className="jutsu-release"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
