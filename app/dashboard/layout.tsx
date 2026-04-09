"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
