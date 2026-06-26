import { pgTable, text, numeric, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const invoicesTable = pgTable("invoices", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  nftTokenId: text("nft_token_id"),
  vendorAddress: text("vendor_address").notNull(),
  vendorName: text("vendor_name").notNull(),
  buyerAddress: text("buyer_address").notNull(),
  buyerName: text("buyer_name").notNull(),
  amount: numeric("amount", { precision: 20, scale: 6 }).notNull(),
  currency: text("currency").notNull().default("USDC"),
  dueDate: timestamp("due_date").notNull(),
  status: text("status").notNull().default("draft"),
  description: text("description").notNull(),
  discountRate: numeric("discount_rate", { precision: 5, scale: 2 }).notNull().default("5"),
  fundedAmount: numeric("funded_amount", { precision: 20, scale: 6 }),
  fundedBy: text("funded_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInvoiceSchema = createInsertSchema(invoicesTable).omit({ createdAt: true });
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoicesTable.$inferSelect;
