import { pgTable, text, numeric, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vaultGoalsTable = pgTable("vault_goals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  targetAmount: numeric("target_amount", { precision: 20, scale: 6 }).notNull(),
  currentAmount: numeric("current_amount", { precision: 20, scale: 6 }).notNull().default("0"),
  currency: text("currency").notNull().default("USDC"),
  deadline: timestamp("deadline"),
  autoSaveEnabled: boolean("auto_save_enabled").notNull().default(false),
  autoSaveAmount: numeric("auto_save_amount", { precision: 20, scale: 6 }),
  type: text("type").notNull().default("personal"),
  inflationProtected: boolean("inflation_protected").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pointsEventsTable = pgTable("points_events", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  points: integer("points").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const autonomousAgentsTable = pgTable("autonomous_agents", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  status: text("status").notNull().default("active"),
  goal: text("goal").notNull(),
  riskTolerance: text("risk_tolerance").notNull(),
  monthlyBudget: numeric("monthly_budget", { precision: 20, scale: 6 }).notNull(),
  legalJurisdiction: text("legal_jurisdiction").notNull(),
  lastAction: text("last_action"),
  nextScheduledAction: timestamp("next_scheduled_action"),
  totalSaved: numeric("total_saved", { precision: 20, scale: 6 }).notNull().default("0"),
  totalOptimized: numeric("total_optimized", { precision: 20, scale: 6 }).notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVaultGoalSchema = createInsertSchema(vaultGoalsTable).omit({ createdAt: true });
export type InsertVaultGoal = z.infer<typeof insertVaultGoalSchema>;
export type VaultGoal = typeof vaultGoalsTable.$inferSelect;

export const insertAutonomousAgentSchema = createInsertSchema(autonomousAgentsTable).omit({ createdAt: true });
export type InsertAutonomousAgent = z.infer<typeof insertAutonomousAgentSchema>;
export type AutonomousAgent = typeof autonomousAgentsTable.$inferSelect;
