"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, type ExpenseCategory } from "@/lib/db/schema/expenses";
import { Plus } from "lucide-react";
import { addExpense, checkLimitWarnings } from "@/lib/db/actions";
import { toast, jutsuWarning, missionComplete, missionFailed } from "@/lib/toast";

interface ExpenseFormProps {
  compact?: boolean;
}

export function ExpenseForm({ compact = false }: ExpenseFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Other");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const amountCents = Math.round(parseFloat(amount) * 100);

    if (isNaN(amountCents) || amountCents <= 0) {
      toast({
        title: "❌ Invalid Amount",
        description: "Please enter a valid amount.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      // Check limits before adding
      const warnings = await checkLimitWarnings(amountCents);

      // Show warnings if limits are exceeded
      if (warnings.daily) {
        jutsuWarning(
          `Adding this expense will exceed your daily budget! Current: $${(warnings.currentDaily / 100).toFixed(2)}`
        );
      }
      if (warnings.monthly) {
        setTimeout(() => {
          jutsuWarning(
            `Adding this expense will exceed your monthly budget! Current: $${(warnings.currentMonthly / 100).toFixed(2)}`
          );
        }, 500);
      }
      if (warnings.yearly) {
        setTimeout(() => {
          jutsuWarning(
            `Adding this expense will exceed your yearly budget! Current: $${(warnings.currentYearly / 100).toFixed(2)}`
          );
        }, 1000);
      }

      await addExpense({
        amount: amountCents,
        category,
        description: description || undefined,
        date,
      });

      missionComplete(
        `Added $${(amountCents / 100).toFixed(2)} expense in ${category}`
      );

      // Reset form
      setAmount("");
      setCategory("Other");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setOpen(false);
    } catch (error: any) {
      missionFailed(error.message || "Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="amount-compact">Amount ($)</Label>
          <Input
            id="amount-compact"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="category-compact">Category</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Adding..." : "Add Expense"}
        </Button>
      </form>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              type="text"
              placeholder="Lunch at Ichiraku Ramen"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
