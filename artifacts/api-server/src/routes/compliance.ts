import { Router } from "express";

const router = Router();

// Simulated compliance check (in production: Chainalysis/TRM Labs API)
const BLOCKED_ADDRESSES = new Set(["0x0000000000000000000000000000000000000001"]);

// POST /compliance/check
router.post("/compliance/check", (req, res) => {
  const { address, chain } = req.body;
  if (!address) return res.status(400).json({ error: "Address required" });

  const isBlocked = BLOCKED_ADDRESSES.has(address.toLowerCase());
  const riskScore = isBlocked ? 95 : Math.floor(Math.random() * 30);
  const riskLevel = riskScore >= 75 ? "blocked" : riskScore >= 50 ? "high" : riskScore >= 25 ? "medium" : "low";

  res.json({
    address,
    riskLevel,
    riskScore,
    flags: isBlocked ? ["OFAC Sanctioned", "High-risk jurisdiction"] : [],
    sanctioned: isBlocked,
    amlPassed: !isBlocked,
    checkedAt: new Date().toISOString(),
  });
});

// GET /compliance/kyc/status
router.get("/compliance/kyc/status", (req, res) => {
  res.json({
    status: "approved",
    level: "enhanced",
    submittedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    approvedAt: new Date(Date.now() - 28 * 86400000).toISOString(),
    limits: {
      dailySend: 50000,
      monthlySend: 500000,
      crossBorderLimit: 100000,
    },
  });
});

export default router;
