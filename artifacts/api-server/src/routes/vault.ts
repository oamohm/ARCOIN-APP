import { Router } from "express";
import { db } from "@workspace/db";
import { vaultGoalsTable, pointsEventsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

function serializeGoal(g: typeof vaultGoalsTable.$inferSelect) {
  return {
    ...g,
    targetAmount: parseFloat(g.targetAmount),
    currentAmount: parseFloat(g.currentAmount),
    autoSaveAmount: g.autoSaveAmount ? parseFloat(g.autoSaveAmount) : null,
    deadline: g.deadline?.toISOString() || null,
    createdAt: g.createdAt.toISOString(),
  };
}

// GET /vault/goals
router.get("/vault/goals", async (req, res) => {
  const goals = await db.select().from(vaultGoalsTable).where(eq(vaultGoalsTable.userId, "demo-user"));
  res.json(goals.map(serializeGoal));
});

// POST /vault/goals
router.post("/vault/goals", async (req, res) => {
  const { name, targetAmount, currency, deadline, autoSaveEnabled, autoSaveAmount, type, inflationProtected } = req.body;
  if (!name || !targetAmount) return res.status(400).json({ error: "Name and target amount required" });

  const id = randomUUID();
  await db.insert(vaultGoalsTable).values({
    id,
    userId: "demo-user",
    name,
    targetAmount: targetAmount.toString(),
    currentAmount: "0",
    currency: currency || "USDC",
    deadline: deadline ? new Date(deadline) : null,
    autoSaveEnabled: autoSaveEnabled ?? false,
    autoSaveAmount: autoSaveAmount?.toString() || null,
    type: type || "personal",
    inflationProtected: inflationProtected ?? false,
  });

  const [goal] = await db.select().from(vaultGoalsTable).where(eq(vaultGoalsTable.id, id)).limit(1);
  res.status(201).json(serializeGoal(goal!));
});

// POST /vault/deposit
router.post("/vault/deposit", async (req, res) => {
  const { goalId, amount } = req.body;
  if (!goalId || !amount) return res.status(400).json({ error: "Goal ID and amount required" });

  const [goal] = await db.select().from(vaultGoalsTable).where(eq(vaultGoalsTable.id, goalId)).limit(1);
  if (!goal) return res.status(404).json({ error: "Goal not found" });

  const newAmount = parseFloat(goal.currentAmount) + amount;
  await db.update(vaultGoalsTable).set({ currentAmount: newAmount.toString() }).where(eq(vaultGoalsTable.id, goalId));

  const [updated] = await db.select().from(vaultGoalsTable).where(eq(vaultGoalsTable.id, goalId)).limit(1);
  res.json(serializeGoal(updated!));
});

// GET /points/balance
router.get("/points/balance", async (req, res) => {
  const [user] = await db.select().from(usersTable).limit(1);
  const points = user?.arcoinPoints || 4250;

  const tier = points < 1000 ? "bronze" : points < 5000 ? "silver" : points < 15000 ? "gold" : points < 50000 ? "platinum" : "diamond";
  const tierThresholds: Record<string, number> = { bronze: 1000, silver: 5000, gold: 15000, platinum: 50000, diamond: 100000 };

  res.json({
    balance: points,
    tier,
    nextTierPoints: tierThresholds[tier] - points,
    multiplier: tier === "bronze" ? 1 : tier === "silver" ? 1.5 : tier === "gold" ? 2 : tier === "platinum" ? 3 : 5,
    badges: ["Early Adopter", "Verified KYC", "Power Trader"],
  });
});

// GET /points/history
router.get("/points/history", async (req, res) => {
  const events = await db.select().from(pointsEventsTable).where(eq(pointsEventsTable.userId, "demo-user")).limit(20);
  res.json(events.map(e => ({ ...e, createdAt: e.createdAt.toISOString() })));
});

// POST /points/redeem
router.post("/points/redeem", async (req, res) => {
  const { pointsToRedeem } = req.body;
  const [user] = await db.select().from(usersTable).limit(1);
  const current = user?.arcoinPoints || 4250;
  const newBalance = Math.max(0, current - (pointsToRedeem || 0));

  if (user) {
    await db.update(usersTable).set({ arcoinPoints: newBalance }).where(eq(usersTable.id, user.id));
  }

  const tier = newBalance < 1000 ? "bronze" : newBalance < 5000 ? "silver" : newBalance < 15000 ? "gold" : newBalance < 50000 ? "platinum" : "diamond";
  res.json({ balance: newBalance, tier, nextTierPoints: 5000 - newBalance, multiplier: 2, badges: ["Early Adopter", "Verified KYC"] });
});

export default router;
