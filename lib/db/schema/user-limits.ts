import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const userLimits = pgTable("user_limits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dailyLimitCents: integer("daily_limit_cents"),
  monthlyLimitCents: integer("monthly_limit_cents"),
  yearlyLimitCents: integer("yearly_limit_cents"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userLimitsRelations = relations(userLimits, ({ one }) => ({
  user: one(users, {
    fields: [userLimits.userId],
    references: [users.id],
  }),
}));

export type UserLimit = typeof userLimits.$inferSelect;
export type NewUserLimit = typeof userLimits.$inferInsert;
