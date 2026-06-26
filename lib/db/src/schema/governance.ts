import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const proposalsTable = pgTable("proposals", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  proposer: text("proposer").notNull(),
  type: text("type").notNull().default("general"),
  status: text("status").notNull().default("active"),
  votesFor: integer("votes_for").notNull().default(0),
  votesAgainst: integer("votes_against").notNull().default(0),
  quorum: integer("quorum").notNull().default(100),
  deadline: timestamp("deadline").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const votesTable = pgTable("votes", {
  id: text("id").primaryKey(),
  proposalId: text("proposal_id").notNull(),
  voter: text("voter").notNull(),
  support: boolean("support").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const multisigTxsTable = pgTable("multisig_txs", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  toAddress: text("to_address").notNull(),
  amount: text("amount").notNull(),
  currency: text("currency").notNull().default("USDC"),
  description: text("description"),
  threshold: integer("threshold").notNull().default(2),
  signaturesCount: integer("signatures_count").notNull().default(0),
  signers: text("signers").notNull().default("[]"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertProposalSchema = createInsertSchema(proposalsTable).omit({ createdAt: true });
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposalsTable.$inferSelect;

export const insertMultisigTxSchema = createInsertSchema(multisigTxsTable).omit({ createdAt: true });
export type InsertMultisigTx = z.infer<typeof insertMultisigTxSchema>;
export type MultisigTx = typeof multisigTxsTable.$inferSelect;
