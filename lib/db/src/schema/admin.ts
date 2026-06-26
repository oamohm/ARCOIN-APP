import { pgTable, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ownerWalletTable = pgTable("owner_wallet", {
  id: text("id").primaryKey().default("singleton"),
  address: text("address").notNull(),
  totalEarnings: numeric("total_earnings", { precision: 20, scale: 6 }).notNull().default("0"),
  feeRevenue: numeric("fee_revenue", { precision: 20, scale: 6 }).notNull().default("0"),
  subscriptionRevenue: numeric("subscription_revenue", { precision: 20, scale: 6 }).notNull().default("0"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOwnerWalletSchema = createInsertSchema(ownerWalletTable);
export type InsertOwnerWallet = z.infer<typeof insertOwnerWalletSchema>;
export type OwnerWallet = typeof ownerWalletTable.$inferSelect;
