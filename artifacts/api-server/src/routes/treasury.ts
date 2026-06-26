import { Router } from "express";

const router = Router();

// GET /treasury/overview
router.get("/treasury/overview", (req, res) => {
  const now = new Date();
  const trend = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(now.getTime() - (29 - i) * 86400000).toISOString().split("T")[0],
    balance: 120000 + Math.floor(Math.random() * 40000),
  }));

  res.json({
    totalBalance: 145230.50,
    chains: [
      { chain: "Arc", chainId: 5042002, usdc: 98450.00, nativeToken: 5.2, nativeSymbol: "ARC", usdValue: 98450.00 },
      { chain: "Ethereum", chainId: 1, usdc: 32100.50, nativeToken: 1.8, nativeSymbol: "ETH", usdValue: 35820.50 },
      { chain: "Solana", chainId: 101, usdc: 10500.00, nativeToken: 45.3, nativeSymbol: "SOL", usdValue: 10980.75 },
      { chain: "Polygon", chainId: 137, usdc: 4180.00, nativeToken: 2200.0, nativeSymbol: "MATIC", usdValue: 3699.50 },
    ],
    monthlyInflow: 78450.00,
    monthlyOutflow: 52300.25,
    netChange: 26149.75,
    last30DaysTrend: trend,
  });
});

// GET /treasury/departments
router.get("/treasury/departments", (req, res) => {
  res.json([
    { department: "Engineering", amount: 18500.00, percentage: 35.4, currency: "USDC" },
    { department: "Operations", amount: 11200.00, percentage: 21.4, currency: "USDC" },
    { department: "Marketing", amount: 8750.00, percentage: 16.7, currency: "USDC" },
    { department: "Finance", amount: 7400.00, percentage: 14.2, currency: "USDC" },
    { department: "HR", amount: 4800.00, percentage: 9.2, currency: "USDC" },
    { department: "Legal", amount: 1650.25, percentage: 3.1, currency: "USDC" },
  ]);
});

// GET /treasury/audit-log
router.get("/treasury/audit-log", (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const entries = Array.from({ length: limit }, (_, i) => ({
    id: `audit-${i + (page - 1) * limit}`,
    action: ["PAYMENT_SENT", "PAYMENT_RECEIVED", "SWAP_EXECUTED", "BRIDGE_INITIATED", "STREAMING_STARTED", "MULTISIG_SIGNED"][i % 6],
    actor: `0x${Math.random().toString(16).substring(2, 12)}...`,
    details: ["USDC transferred to vendor", "Payroll disbursement", "USDC→EURC swap at 0.92", "Bridge to Ethereum via CCTP", "Bulk payout job started", "2/3 multisig signed"][i % 6],
    txHash: i % 2 === 0 ? `0x${Math.random().toString(16).substring(2, 66)}` : null,
    chain: ["Arc", "Ethereum", "Arc", "Polygon", "Arc", null][i % 6],
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  }));

  res.json({ entries, total: 247, page });
});

// GET /treasury/report
router.get("/treasury/report", (req, res) => {
  const { format = "csv" } = req.query;
  res.json({
    format,
    downloadUrl: `/api/treasury/report/download?format=${format}`,
    generatedAt: new Date().toISOString(),
    rows: 247,
  });
});

export default router;
