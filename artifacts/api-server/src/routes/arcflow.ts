import { Router } from "express";
import { db } from "@workspace/db";
import { invoicesTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

function serializeInvoice(inv: typeof invoicesTable.$inferSelect) {
  return {
    ...inv,
    amount: parseFloat(inv.amount),
    discountRate: parseFloat(inv.discountRate),
    fundedAmount: inv.fundedAmount ? parseFloat(inv.fundedAmount) : null,
    dueDate: inv.dueDate.toISOString(),
    createdAt: inv.createdAt.toISOString(),
  };
}

// GET /arcflow/invoices
router.get("/arcflow/invoices", async (req, res) => {
  const invoices = await db.select().from(invoicesTable);
  const { status } = req.query;
  const filtered = status ? invoices.filter(i => i.status === status) : invoices;
  res.json(filtered.map(serializeInvoice));
});

// POST /arcflow/invoices
router.post("/arcflow/invoices", async (req, res) => {
  const { buyerAddress, buyerName, amount, currency, dueDate, description, discountRate } = req.body;
  if (!buyerAddress || !amount || !dueDate) return res.status(400).json({ error: "Required fields missing" });

  const id = randomUUID();
  const tokenId = `ARC-INV-${Math.floor(Math.random() * 9000) + 1000}`;

  await db.insert(invoicesTable).values({
    id,
    userId: "demo-user",
    nftTokenId: tokenId,
    vendorAddress: "0x742d35Cc6634C0532925a3b8D4C9e7a3c8E2f1a9",
    vendorName: "ARCOIN Demo Vendor",
    buyerAddress,
    buyerName,
    amount: amount.toString(),
    currency: currency || "USDC",
    dueDate: new Date(dueDate),
    status: "minted",
    description,
    discountRate: (discountRate || 5).toString(),
    fundedAmount: null,
    fundedBy: null,
  });

  const [inv] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, id)).limit(1);
  res.status(201).json(serializeInvoice(inv!));
});

// GET /arcflow/marketplace
router.get("/arcflow/marketplace", async (req, res) => {
  const invoices = await db.select().from(invoicesTable);
  const listed = invoices.filter(i => ["minted", "listed"].includes(i.status));

  res.json({
    invoices: listed.map(serializeInvoice),
    totalLiquidity: listed.reduce((s, i) => s + parseFloat(i.amount), 0) || 485000,
    avgReturn: 8.5,
    totalFunded: 23,
  });
});

// POST /arcflow/marketplace/:invoiceId/fund
router.post("/arcflow/marketplace/:invoiceId/fund", async (req, res) => {
  const { invoiceId } = req.params;
  const { amount } = req.body;

  const [inv] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, invoiceId)).limit(1);
  if (!inv) return res.status(404).json({ error: "Invoice not found" });

  await db.update(invoicesTable)
    .set({ status: "funded", fundedAmount: amount.toString(), fundedBy: "0x742d35Cc6634C0532925a3b8D4C9e7a3c8E2f1a9" })
    .where(eq(invoicesTable.id, invoiceId));

  const [updated] = await db.select().from(invoicesTable).where(eq(invoicesTable.id, invoiceId)).limit(1);
  res.json(serializeInvoice(updated!));
});

// GET /arcflow/investor/dashboard
router.get("/arcflow/investor/dashboard", async (req, res) => {
  const investments = await db.select().from(invoicesTable);
  const funded = investments.filter(i => i.status === "funded");

  const monthlyEarnings = Array.from({ length: 6 }, (_, i) => ({
    month: new Date(2026, i, 1).toLocaleString("default", { month: "short" }),
    earnings: Math.floor(Math.random() * 5000 + 2000),
    return: (Math.random() * 4 + 6).toFixed(2),
  }));

  res.json({
    portfolioValue: 85000,
    totalReturn: 6842.50,
    returnRate: 8.05,
    activeInvestments: funded.length || 4,
    investments: funded.slice(0, 5).map(serializeInvoice),
    monthlyEarnings,
  });
});

export default router;
