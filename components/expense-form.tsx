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
import { Plus, Scroll, Zap } from "lucide-react";
import { addExpense, checkLimitWarnings } from "@/lib/db/actions";
import { toast, jutsuWarning, missionComplete, missionFailed } from "@/lib/toast";
import { motion } from "framer-motion";

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
        title: "Invalid Amount",
        description: "Your math is worse than Naruto's academy days.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const warnings = await checkLimitWarnings(amountCents);

      if (warnings.daily) {
        jutsuWarning(`Daily Seal Breach! You've spent ${(warnings.currentDaily / 100).toFixed(0)} ryo already.`);
      }
      if (warnings.monthly) {
        setTimeout(() => {
          jutsuWarning(`Monthly Seal Breach! Current flow: ${(warnings.currentMonthly / 100).toFixed(0)} ryo.`);
        }, 500);
      }

      await addExpense({
        amount: amountCents,
        category,
        description: description || undefined,
        date,
      });

      missionComplete(`Added ${(amountCents / 100).toFixed(2)} ryo to ${category}.`);

      setAmount("");
      setCategory("Other");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setOpen(false);
    } catch (error: any) {
      missionFailed(error.message || "The scroll was rejected by the database.");
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="amount" className="font-black uppercase tracking-widest text-[10px] text-primary">Resource Amount (Ryo)</Label>
        <div className="relative">
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            className="h-12 text-lg font-bold border-2 focus:ring-primary/20 transition-all"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-primary italic">RYO</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="font-black uppercase tracking-widest text-[10px] text-primary">Chakra Nature</Label>
        <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
          <SelectTrigger className="h-12 font-bold border-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat} className="font-bold">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!compact && (
        <>
          <div className="space-y-2">
            <Label htmlFor="description" className="font-black uppercase tracking-widest text-[10px] text-primary">Mission Intel</Label>
            <Input
              id="description"
              type="text"
              placeholder="Ichiraku Ramen for dinner..."
              className="h-12 border-2 font-medium"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="font-black uppercase tracking-widest text-[10px] text-primary">Time Stamp</Label>
            <Input
              id="date"
              type="date"
              className="h-12 border-2 font-bold"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </>
      )}

      <Button 
        type="submit" 
        className="naruto-button w-full h-14 text-lg mt-4 group"
        disabled={loading}
      >
        <Zap className={`h-5 w-5 mr-2 transition-transform group-hover:scale-125 ${loading ? 'animate-spin' : ''}`} />
        {loading ? "SEALING..." : (compact ? "QUICK SEAL" : "UPDATE SCROLL")}
      </Button>
    </form>
  );

  if (compact) return formContent;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="naruto-button h-11 px-8">
          <Scroll className="h-4 w-4 mr-2" />
          NEW MISSION
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-2 border-primary/20 rounded-2xl p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter">
            Add New <span className="text-primary italic">Record</span>
          </DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
