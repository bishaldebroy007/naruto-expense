"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users, expenses, userLimits } from "@/lib/db/schema";
import { eq, and, gte, lte, desc, sql, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Expense, ExpenseCategory } from "./schema/expenses";
import type { UserLimit } from "./schema/user-limits";

// ==================== USER OPERATIONS ====================

export async function getCurrentUserId() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  // Check if user profile exists, if not create one
  const existingUser = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (existingUser.length === 0) {
    const [newUser] = await db
      .insert(users)
      .values({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.name || null,
      })
      .returning({ id: users.id });

    // Create default user limits
    await db.insert(userLimits).values({
      userId: newUser.id,
    });

    return newUser.id;
  }

  return existingUser[0].id;
}

// ==================== EXPENSE OPERATIONS ====================

export type ExpenseFilters = {
  startDate?: string;
  endDate?: string;
  category?: ExpenseCategory;
  page?: number;
  limit?: number;
};

export async function getExpenses(filters: ExpenseFilters = {}) {
  const userId = await getCurrentUserId();
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  const conditions = [eq(expenses.userId, userId)];

  if (filters.startDate) {
    conditions.push(gte(expenses.date, filters.startDate));
  }
  if (filters.endDate) {
    conditions.push(lte(expenses.date, filters.endDate));
  }
  if (filters.category) {
    conditions.push(eq(expenses.category, filters.category));
  }

  const [totalResult] = await db
    .select({ count: count() })
    .from(expenses)
    .where(and(...conditions));

  const expenseList = await db
    .select()
    .from(expenses)
    .where(and(...conditions))
    .orderBy(desc(expenses.date), desc(expenses.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    expenses: expenseList,
    total: totalResult?.count || 0,
    page,
    totalPages: Math.ceil((totalResult?.count || 0) / limit),
  };
}

export async function addExpense(data: {
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: string;
}) {
  const userId = await getCurrentUserId();

  const [newExpense] = await db
    .insert(expenses)
    .values({
      ...data,
      userId,
    })
    .returning();

  revalidatePath("/dashboard");
  return newExpense;
}

export async function updateExpense(
  expenseId: string,
  data: {
    amount?: number;
    category?: ExpenseCategory;
    description?: string;
    date?: string;
  }
) {
  const userId = await getCurrentUserId();

  const [updated] = await db
    .update(expenses)
    .set(data)
    .where(and(eq(expenses.id, expenseId), eq(expenses.userId, userId)))
    .returning();

  revalidatePath("/dashboard");
  return updated;
}

export async function deleteExpense(expenseId: string) {
  const userId = await getCurrentUserId();

  await db
    .delete(expenses)
    .where(and(eq(expenses.id, expenseId), eq(expenses.userId, userId)));

  revalidatePath("/dashboard");
}

// ==================== SPENDING LIMITS ====================

export async function getUserLimits() {
  const userId = await getCurrentUserId();

  const [limits] = await db
    .select()
    .from(userLimits)
    .where(eq(userLimits.userId, userId))
    .limit(1);

  return limits;
}

export async function updateUserLimits(data: {
  dailyLimitCents?: number | null;
  monthlyLimitCents?: number | null;
  yearlyLimitCents?: number | null;
}) {
  const userId = await getCurrentUserId();

  const [updated] = await db
    .update(userLimits)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(userLimits.userId, userId))
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return updated;
}

export async function checkLimitWarnings(
  newExpenseAmount: number
): Promise<{
  daily: boolean;
  monthly: boolean;
  yearly: boolean;
  currentDaily: number;
  currentMonthly: number;
  currentYearly: number;
}> {
  const userId = await getCurrentUserId();
  const limits = await getUserLimits();

  if (!limits) {
    return {
      daily: false,
      monthly: false,
      yearly: false,
      currentDaily: 0,
      currentMonthly: 0,
      currentYearly: 0,
    };
  }

  const today = new Date().toISOString().split("T")[0];
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1)
    .toISOString()
    .split("T")[0];

  // Calculate spending for each period
  const [dailySpending] = await db
    .select({ total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)` })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        eq(expenses.date, today)
      )
    );

  const [monthlySpending] = await db
    .select({ total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)` })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, firstDayOfMonth.toISOString().split("T")[0])
      )
    );

  const [yearlySpending] = await db
    .select({ total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)` })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, firstDayOfYear)
      )
    );

  const currentDaily = dailySpending?.total || 0;
  const currentMonthly = monthlySpending?.total || 0;
  const currentYearly = yearlySpending?.total || 0;

  const warnings = {
    daily: limits.dailyLimitCents
      ? currentDaily + newExpenseAmount > limits.dailyLimitCents
      : false,
    monthly: limits.monthlyLimitCents
      ? currentMonthly + newExpenseAmount > limits.monthlyLimitCents
      : false,
    yearly: limits.yearlyLimitCents
      ? currentYearly + newExpenseAmount > limits.yearlyLimitCents
      : false,
    currentDaily,
    currentMonthly,
    currentYearly,
  };

  return warnings;
}

// ==================== DASHBOARD STATS ====================

export async function getDashboardStats() {
  const userId = await getCurrentUserId();

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const firstDayOfYear = new Date(now.getFullYear(), 0, 1)
    .toISOString()
    .split("T")[0];

  // Monthly spending
  const [monthlyTotal] = await db
    .select({ total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)` })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, firstDayOfMonth)
      )
    );

  // Yearly spending
  const [yearlyTotal] = await db
    .select({ total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)` })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, firstDayOfYear)
      )
    );

  // All-time spending
  const [allTimeTotal] = await db
    .select({ total: sql<number>`COALESCE(SUM(${expenses.amount}), 0)` })
    .from(expenses)
    .where(eq(expenses.userId, userId));

  // Top category this month
  const topCategory = await db
    .select({
      category: expenses.category,
      total: sql<number>`SUM(${expenses.amount})`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, firstDayOfMonth)
      )
    )
    .groupBy(expenses.category)
    .orderBy(sql`SUM(${expenses.amount}) DESC`)
    .limit(1);

  // Spending by category this month
  const categoryBreakdown = await db
    .select({
      category: expenses.category,
      total: sql<number>`SUM(${expenses.amount})`,
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.date, firstDayOfMonth)
      )
    )
    .groupBy(expenses.category)
    .orderBy(sql`SUM(${expenses.amount}) DESC`);

  return {
    monthlySpent: monthlyTotal?.total || 0,
    yearlySpent: yearlyTotal?.total || 0,
    allTimeSpent: allTimeTotal?.total || 0,
    topCategory: topCategory[0]?.category || null,
    categoryBreakdown: categoryBreakdown || [],
  };
}

// ==================== CSV EXPORT ====================

export async function exportExpensesToCSV() {
  const userId = await getCurrentUserId();

  const allExpenses = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.date));

  // Convert to CSV format
  const headers = ["Date", "Amount", "Category", "Description"];
  const rows = allExpenses.map((expense) => [
    expense.date,
    (expense.amount / 100).toFixed(2), // Convert cents to dollars
    expense.category,
    expense.description || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  return csvContent;
}
