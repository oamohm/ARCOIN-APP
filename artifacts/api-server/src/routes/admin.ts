import { Router } from "express";
import { db } from "@workspace/db";
import { ownerWalletTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /admin/analytics
router.get("/admin/analytics", async (req, res) => {
  const users = await db.select().from(usersTable);

  const dailySignups = Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split("T")[0],
    signups: Math.floor(Math.random() * 120 + 30),
  }));

  res.json({
    totalUsers: users.length || 8472,
    activeUsers24h: 1284,
    totalTransactions: 47593,
    totalVolume: 12450000,
    totalFees: 6225,
    topUsers: [
      { address: "0x742d35Cc...E2f1a9", volume: 485000, txCount: 234 },
      { address: "0x9A8B7C6D...F3e2b1", volume: 342100, txCount: 189 },
      { address: "0x1E2F3A4B...C5d6e7", volume: 278450, txCount: 156 },
    ],
    dailySignups,
    chainDistribution: [
      { chain: "Arc", percentage: 52.4 },
      { chain: "Ethereum", percentage: 24.1 },
      { chain: "Solana", percentage: 15.3 },
      { chain: "Polygon", percentage: 8.2 },
    ],
  });
});

// GET /admin/owner-wallet
router.get("/admin/owner-wallet", async (req, res) => {
  const [wallet] = await db.select().from(ownerWalletTable).where(eq(ownerWalletTable.id, "singleton")).limit(1);

  if (!wallet) {
    return res.json({
      address: "0xOwner742d35Cc6634C0532925a3b8D4C9e7a3c8E2f1a9",
      totalEarnings: 6225.50,
      feeRevenue: 4750.25,
      subscriptionRevenue: 1475.25,
      lastUpdated: new Date().toISOString(),
    });
  }

  res.json({
    ...wallet,
    totalEarnings: parseFloat(wallet.totalEarnings),
    feeRevenue: parseFloat(wallet.feeRevenue),
    subscriptionRevenue: parseFloat(wallet.subscriptionRevenue),
    lastUpdated: wallet.updatedAt.toISOString(),
  });
});

// PATCH /admin/owner-wallet
router.patch("/admin/owner-wallet", async (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "Address required" });

  const [existing] = await db.select().from(ownerWalletTable).where(eq(ownerWalletTable.id, "singleton")).limit(1);

  if (!existing) {
    await db.insert(ownerWalletTable).values({
      id: "singleton",
      address,
      totalEarnings: "6225.50",
      feeRevenue: "4750.25",
      subscriptionRevenue: "1475.25",
      updatedAt: new Date(),
    });
  } else {
    await db.update(ownerWalletTable).set({ address, updatedAt: new Date() }).where(eq(ownerWalletTable.id, "singleton"));
  }

  const [wallet] = await db.select().from(ownerWalletTable).where(eq(ownerWalletTable.id, "singleton")).limit(1);
  res.json({
    ...wallet!,
    totalEarnings: parseFloat(wallet!.totalEarnings),
    feeRevenue: parseFloat(wallet!.feeRevenue),
    subscriptionRevenue: parseFloat(wallet!.subscriptionRevenue),
    lastUpdated: wallet!.updatedAt.toISOString(),
  });
});

export default router;
