"use client";

import { useTheme } from "@/components/theme-provider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sun, Moon, LogOut, Settings, LayoutDashboard, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

export function DashboardHeader() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="group">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <span className="text-3xl group-hover:rotate-12 transition-transform">🍥</span>
            <span className="text-xl font-black tracking-tighter uppercase hidden sm:inline">
              NARUTO <span className="text-primary italic">FINANCE</span>
            </span>
          </motion.div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/dashboard">
              <Button variant="ghost" className="font-bold uppercase tracking-tight hover:text-primary">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Mission Control
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" className="font-bold uppercase tracking-tight hover:text-primary">
                <Settings className="h-4 w-4 mr-2" />
                Village Config
              </Button>
            </Link>
          </nav>

          <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block" />

          {/* Theme Toggle */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/10 transition-colors"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-indigo-500" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </Button>
          </motion.div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-transparent hover:border-primary transition-all">
                <Avatar className="h-full w-full">
                  <AvatarFallback className="bg-primary text-primary-foreground font-black">
                    N
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
              <div className="px-2 py-1.5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shinobi Status</p>
                <p className="text-sm font-bold">Active Ninja</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer font-semibold">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Mission Control
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer font-semibold">
                  <Settings className="mr-2 h-4 w-4" />
                  Village Config
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer font-bold"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Desert Village</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
