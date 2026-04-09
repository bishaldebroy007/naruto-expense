"use client";

import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
}

export function toast({ title, description, type = "info" }: ToastOptions) {
  const icons: Record<string, string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const colors: Record<string, string> = {
    success: "border-green-500 text-green-700 dark:text-green-300",
    error: "border-red-500 text-red-700 dark:text-red-300",
    warning: "border-orange-500 text-orange-700 dark:text-orange-300",
    info: "border-blue-500 text-blue-700 dark:text-blue-300",
  };

  return sonnerToast.custom(
    (t) => (
      <div
        className={`border-l-4 p-4 rounded bg-white dark:bg-gray-800 shadow-lg ${colors[type]}`}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl">{icons[type]}</span>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    ),
    { duration: 4000 }
  );
}

// Naruto-themed toast helpers
export const missionComplete = (description?: string) =>
  toast({
    title: "🍥 Mission Complete!",
    description: description || "Your expense has been recorded.",
    type: "success",
  });

export const missionFailed = (description: string) =>
  toast({
    title: "❌ Mission Failed",
    description,
    type: "error",
  });

export const jutsuWarning = (description: string) =>
  toast({
    title: "⚠️ Jutsu Warning!",
    description,
    type: "warning",
  });

export const infoJutsu = (description: string) =>
  toast({
    title: "ℹ️ Info Jutsu",
    description,
    type: "info",
  });
