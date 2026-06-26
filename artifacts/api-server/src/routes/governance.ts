import { Router } from "express";
import { db } from "@workspace/db";
import { proposalsTable, votesTable, multisigTxsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

function serializeProposal(p: typeof proposalsTable.$inferSelect, userVote?: string | null) {
  return {
    ...p,
    deadline: p.deadline.toISOString(),
    createdAt: p.createdAt.toISOString(),
    userVote: userVote || null,
  };
}

function serializeMultisig(tx: typeof multisigTxsTable.$inferSelect) {
  return {
    ...tx,
    amount: parseFloat(tx.amount),
    signers: JSON.parse(tx.signers),
    createdAt: tx.createdAt.toISOString(),
    userSigned: false,
  };
}

// GET /governance/proposals
router.get("/governance/proposals", async (req, res) => {
  const proposals = await db.select().from(proposalsTable);
  res.json(proposals.map(p => serializeProposal(p)));
});

// POST /governance/proposals
router.post("/governance/proposals", async (req, res) => {
  const { title, description, type, duration } = req.body;
  if (!title || !description) return res.status(400).json({ error: "Title and description required" });

  const id = randomUUID();
  const deadline = new Date(Date.now() + (duration || 7) * 86400000);

  await db.insert(proposalsTable).values({
    id, title, description,
    proposer: "0x742d35Cc6634C0532925a3b8D4C9e7a3c8E2f1a9",
    type: type || "general",
    status: "active",
    votesFor: 0, votesAgainst: 0, quorum: 100,
    deadline,
  });

  const [proposal] = await db.select().from(proposalsTable).where(eq(proposalsTable.id, id)).limit(1);
  res.status(201).json(serializeProposal(proposal!));
});

// POST /governance/proposals/:proposalId/vote
router.post("/governance/proposals/:proposalId/vote", async (req, res) => {
  const { proposalId } = req.params;
  const { support } = req.body;

  const [proposal] = await db.select().from(proposalsTable).where(eq(proposalsTable.id, proposalId)).limit(1);
  if (!proposal) return res.status(404).json({ error: "Proposal not found" });

  await db.insert(votesTable).values({
    id: randomUUID(),
    proposalId,
    voter: "0x742d35Cc6634C0532925a3b8D4C9e7a3c8E2f1a9",
    support,
    reason: req.body.reason || null,
  });

  await db.update(proposalsTable)
    .set(support ? { votesFor: proposal.votesFor + 1 } : { votesAgainst: proposal.votesAgainst + 1 })
    .where(eq(proposalsTable.id, proposalId));

  const [updated] = await db.select().from(proposalsTable).where(eq(proposalsTable.id, proposalId)).limit(1);
  res.json(serializeProposal(updated!, support ? "for" : "against"));
});

// GET /governance/multisig/transactions
router.get("/governance/multisig/transactions", async (req, res) => {
  const txs = await db.select().from(multisigTxsTable);
  res.json(txs.map(serializeMultisig));
});

// POST /governance/multisig/transactions
router.post("/governance/multisig/transactions", async (req, res) => {
  const { title, toAddress, amount, currency, description } = req.body;
  if (!title || !toAddress || !amount) return res.status(400).json({ error: "Required fields missing" });

  const id = randomUUID();
  await db.insert(multisigTxsTable).values({
    id, title, toAddress,
    amount: amount.toString(),
    currency: currency || "USDC",
    description: description || null,
    threshold: 2, signaturesCount: 0,
    signers: "[]", status: "pending",
  });

  const [tx] = await db.select().from(multisigTxsTable).where(eq(multisigTxsTable.id, id)).limit(1);
  res.status(201).json(serializeMultisig(tx!));
});

// POST /governance/multisig/transactions/:txId/sign
router.post("/governance/multisig/transactions/:txId/sign", async (req, res) => {
  const [tx] = await db.select().from(multisigTxsTable).where(eq(multisigTxsTable.id, req.params.txId)).limit(1);
  if (!tx) return res.status(404).json({ error: "Transaction not found" });

  const newCount = tx.signaturesCount + 1;
  const signers = [...JSON.parse(tx.signers), "0x742d35Cc6634C0532925a3b8D4C9e7a3c8E2f1a9"];
  const status = newCount >= tx.threshold ? "ready" : "pending";

  await db.update(multisigTxsTable)
    .set({ signaturesCount: newCount, signers: JSON.stringify(signers), status })
    .where(eq(multisigTxsTable.id, req.params.txId));

  const [updated] = await db.select().from(multisigTxsTable).where(eq(multisigTxsTable.id, req.params.txId)).limit(1);
  res.json(serializeMultisig(updated!));
});

export default router;
