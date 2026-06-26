import { Router } from "express";
import { db } from "@workspace/db";
import { autonomousAgentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

const AI_RESPONSES = [
  "Based on your transaction history, you're spending 34% more on operations this month. Consider reviewing vendor contracts for optimization opportunities.",
  "Your Arc Network balance has grown 12% this week. The current yield opportunity on USDC is 5.2% APY — consider allocating 20% to vault savings.",
  "I detected 3 recurring payments that could be batched into a single streaming job, saving approximately $45 in gas fees monthly.",
  "Your treasury diversification looks healthy across 4 chains. Consider increasing Polygon exposure by 5% for lower transaction costs.",
  "Tax optimization alert: You have $12,450 in deductible business expenses this quarter. Generate a treasury report for your accountant.",
];

// POST /ai/chat
router.post("/ai/chat", (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  const responseIndex = Math.floor(Math.random() * AI_RESPONSES.length);
  res.json({
    response: AI_RESPONSES[responseIndex],
    suggestions: [
      "Generate treasury report",
      "Set up auto-savings",
      "Check compliance status",
      "Optimize gas fees",
    ],
    insights: [
      { type: "spending", value: -34, unit: "%" },
      { type: "savings_opportunity", value: 45, unit: "USD/month" },
    ],
  });
});

// GET /ai/insights
router.get("/ai/insights", (req, res) => {
  res.json({
    spendingAlert: "Operations spending is 34% above monthly average",
    savingSuggestion: "Move 20% of Arc balance to vault for 5.2% APY yield",
    taxOptimization: "$12,450 in deductible expenses identified this quarter",
    marketInsight: "USDC/EURC rate is favorable — optimal window for FX conversion",
    riskScore: 28,
    weeklyTip: "Batch your weekly payments into a streaming job to save up to 60% on gas fees and get Email Verified receipts on every disbursement.",
  });
});

// POST /ai/agent/setup
router.post("/ai/agent/setup", async (req, res) => {
  const { goal, riskTolerance, monthlyBudget, legalJurisdiction } = req.body;
  if (!goal || !riskTolerance || !monthlyBudget || !legalJurisdiction) {
    return res.status(400).json({ error: "All 4 agent parameters required" });
  }

  const id = randomUUID();
  const nextAction = new Date(Date.now() + 24 * 3600000);

  try {
    await db.insert(autonomousAgentsTable).values({
      id,
      userId: "demo-user",
      status: "active",
      goal,
      riskTolerance,
      monthlyBudget: monthlyBudget.toString(),
      legalJurisdiction,
      lastAction: "Agent initialized and calibrated",
      nextScheduledAction: nextAction,
      totalSaved: "0",
      totalOptimized: "0",
    });
  } catch {
    await db.update(autonomousAgentsTable)
      .set({ goal, riskTolerance, monthlyBudget: monthlyBudget.toString(), legalJurisdiction, status: "active" })
      .where(eq(autonomousAgentsTable.userId, "demo-user"));
  }

  const [agent] = await db.select().from(autonomousAgentsTable).where(eq(autonomousAgentsTable.userId, "demo-user")).limit(1);
  res.json({
    ...agent!,
    monthlyBudget: parseFloat(agent!.monthlyBudget),
    totalSaved: parseFloat(agent!.totalSaved),
    totalOptimized: parseFloat(agent!.totalOptimized),
    nextScheduledAction: agent!.nextScheduledAction?.toISOString() || null,
  });
});

// GET /ai/agent
router.get("/ai/agent", async (req, res) => {
  const [agent] = await db.select().from(autonomousAgentsTable).where(eq(autonomousAgentsTable.userId, "demo-user")).limit(1);
  if (!agent) {
    return res.json({
      id: "no-agent",
      status: "stopped",
      goal: "",
      riskTolerance: "moderate",
      monthlyBudget: 0,
      legalJurisdiction: "",
      lastAction: null,
      nextScheduledAction: null,
      totalSaved: 0,
      totalOptimized: 0,
    });
  }
  res.json({
    ...agent,
    monthlyBudget: parseFloat(agent.monthlyBudget),
    totalSaved: parseFloat(agent.totalSaved),
    totalOptimized: parseFloat(agent.totalOptimized),
    nextScheduledAction: agent.nextScheduledAction?.toISOString() || null,
  });
});

export default router;
