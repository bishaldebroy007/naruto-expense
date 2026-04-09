"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { categoryColors } from "@/lib/utils/expenses";
import { formatCurrency } from "@/lib/utils/expenses";

interface ChakraBarChartProps {
  data: Array<{
    category: string;
    total: number;
  }>;
}

export function ChakraBarChart({ data }: ChakraBarChartProps) {
  const chartData = data.map((item) => ({
    name: item.category,
    amount: item.total / 100, // Convert cents to dollars
    fill: categoryColors[item.category as keyof typeof categoryColors] || "#6B7280",
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          className="stroke-muted-foreground text-xs"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          className="stroke-muted-foreground text-xs"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
