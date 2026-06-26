import { pgTable, text, numeric, boolean, timestamp, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transactionsTable = pgTable("transactions", {
  id: text("id").primaryKey(),
  txHash: text("tx_hash").notNull(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"),
  amount: numeric("amount", { precision: 20, scale: 6 }).notNull(),
  currency: text("currency").notNull().default("USDC"),
  chain: text("chain").notNull().default("Arc"),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  memo: text("memo"),
  fee: numeric("fee", { precision: 20, scale: 6 }).notNull().default("0"),
  emailVerified: boolean("email_verified").notNull().default(false),
  explorerUrl: text("explorer_url").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ createdAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;

export const streamingJobsTable = pgTable("streaming_jobs", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default("pending"),
  totalRecipients: integer("total_recipients").notNull().default(0),
  completedCount: integer("completed_count").notNull().default(0),
  failedCount: integer("failed_count").notNull().default(0),
  totalAmount: numeric("total_amount", { precision: 20, scale: 6 }).notNull().default("0"),
  disbursedAmount: numeric("disbursed_amount", { precision: 20, scale: 6 }).notNull().default("0"),
  currency: text("currency").notNull().default("USDC"),
  chain: text("chain").notNull().default("Arc"),
  recipients: text("recipients").notNull().default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertStreamingJobSchema = createInsertSchema(streamingJobsTable).omit({ createdAt: true, updatedAt: true });
export type InsertStreamingJob = z.infer<typeof insertStreamingJobSchema>;
export type StreamingJob = typeof streamingJobsTable.$inferSelect;
