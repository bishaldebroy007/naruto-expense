import {
  Utensils,
  Car,
  ShoppingBag,
  ScrollText,
  Eye,
  HeartPulse,
  HelpCircle,
} from "lucide-react";
import type { ExpenseCategory } from "@/lib/db/schema/expenses";

export const categoryIcons: Record<ExpenseCategory, React.ElementType> = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: ScrollText,
  Entertainment: Eye,
  Health: HeartPulse,
  Other: HelpCircle,
};

export const categoryColors: Record<ExpenseCategory, string> = {
  Food: "#F97316", // Orange (Fire style)
  Transport: "#06B6D4", // Cyan (Wind style)
  Shopping: "#EC4899", // Pink
  Bills: "#8B5CF6", // Purple (Lightning style)
  Entertainment: "#EAB308", // Yellow
  Health: "#22C55E", // Green
  Other: "#6B7280", // Gray
};

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
