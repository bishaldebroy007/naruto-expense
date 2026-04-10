"use client";

import { toast as sonnerToast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ToastOptions {
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
}

export function toast({ title, description, type = "info" }: ToastOptions) {
  const icons: Record<string, string> = {
    success: "🍥",
    error: "❌",
    warning: "⚠️",
    info: "📜",
  };

  const borderColors: Record<string, string> = {
    success: "border-primary",
    error: "border-destructive",
    warning: "border-yellow-500",
    info: "border-blue-500",
  };

  return sonnerToast.custom(
    (t) => (
      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`w-full max-w-sm bg-card/95 backdrop-blur-md border-2 rounded-xl shadow-2xl p-4 ${borderColors[type]}`}
      >
        <div className="flex items-start gap-4">
          <div className="text-2xl mt-1">{icons[type]}</div>
          <div className="flex-1">
            <h3 className="font-black uppercase tracking-tight text-foreground">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm font-medium text-muted-foreground leading-snug">
                {description}
              </p>
            )}
          </div>
          <button 
            onClick={() => sonnerToast.dismiss(t)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>
        {/* Progress bar effect */}
        <motion.div 
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 4, ease: "linear" }}
          className={`absolute bottom-0 left-0 right-0 h-1 bg-current opacity-20 origin-left`}
        />
      </motion.div>
    ),
    { duration: 4000 }
  );
}

// Naruto-themed toast helpers
export const missionComplete = (description?: string) =>
  toast({
    title: "Mission Complete!",
    description: description || "The scroll has been updated.",
    type: "success",
  });

export const missionFailed = (description: string) =>
  toast({
    title: "Mission Failed",
    description,
    type: "error",
  });

export const jutsuWarning = (description: string) =>
  toast({
    title: "Jutsu Warning!",
    description,
    type: "warning",
  });

export const infoJutsu = (description: string) =>
  toast({
    title: "Info Jutsu",
    description,
    type: "info",
  });
