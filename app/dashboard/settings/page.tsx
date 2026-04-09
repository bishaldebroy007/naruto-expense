"use client";

import { useEffect, useState } from "react";
import { getUserLimits, updateUserLimits } from "@/lib/db/actions";
import { RasenganLoader } from "@/components/rasengan-loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, missionComplete, missionFailed } from "@/lib/toast";
import { DollarSign } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dailyLimit, setDailyLimit] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [yearlyLimit, setYearlyLimit] = useState("");

  useEffect(() => {
    async function loadLimits() {
      try {
        const limits = await getUserLimits();
        if (limits) {
          setDailyLimit(limits.dailyLimitCents ? (limits.dailyLimitCents / 100).toString() : "");
          setMonthlyLimit(limits.monthlyLimitCents ? (limits.monthlyLimitCents / 100).toString() : "");
          setYearlyLimit(limits.yearlyLimitCents ? (limits.yearlyLimitCents / 100).toString() : "");
        }
      } catch (error) {
        console.error("Failed to load limits:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLimits();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    try {
      await updateUserLimits({
        dailyLimitCents: dailyLimit ? Math.round(parseFloat(dailyLimit) * 100) : null,
        monthlyLimitCents: monthlyLimit ? Math.round(parseFloat(monthlyLimit) * 100) : null,
        yearlyLimitCents: yearlyLimit ? Math.round(parseFloat(yearlyLimit) * 100) : null,
      });

      missionComplete("Your spending limits have been updated.");
    } catch (error: any) {
      missionFailed(error.message || "Failed to update limits.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <RasenganLoader />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your spending limits and preferences
        </p>
      </div>

      {/* Spending Limits */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Limits</CardTitle>
          <CardDescription>
            Set budget limits for your expenses. You'll receive warnings when approaching these limits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dailyLimit">Daily Limit ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="dailyLimit"
                type="number"
                step="0.01"
                placeholder="No limit"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyLimit">Monthly Limit ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="monthlyLimit"
                type="number"
                step="0.01"
                placeholder="No limit"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearlyLimit">Yearly Limit ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="yearlyLimit"
                type="number"
                step="0.01"
                placeholder="No limit"
                value={yearlyLimit}
                onChange={(e) => setYearlyLimit(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Limits"}
          </Button>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of Naruto Finance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the theme toggle in the header to switch between Leaf Village (Light) and Akatsuki (Dark) themes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
