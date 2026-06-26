import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, otpCodesTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { randomBytes, randomUUID } from "crypto";
import { logger } from "../lib/logger";

const router = Router();

// POST /auth/email/otp/send
router.post("/auth/email/otp/send", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.insert(otpCodesTable).values({ email, code, expiresAt });

  req.log.info({ email, code }, "OTP generated (mock - in production send via email)");

  res.json({ message: "OTP sent to your email", success: true });
});

// POST /auth/email/otp/verify
router.post("/auth/email/otp/verify", async (req, res) => {
  const { email, otp, walletAddress } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

  const [record] = await db
    .select()
    .from(otpCodesTable)
    .where(
      and(
        eq(otpCodesTable.email, email),
        eq(otpCodesTable.code, otp),
        eq(otpCodesTable.used, false),
        gt(otpCodesTable.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!record) return res.status(401).json({ error: "Invalid or expired OTP" });

  await db.update(otpCodesTable).set({ used: true }).where(eq(otpCodesTable.id, record.id));

  let [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

  if (!user) {
    const id = randomUUID();
    await db.insert(usersTable).values({
      id,
      email,
      walletAddress: walletAddress || null,
      loginMethod: "email",
      tier: "bronze",
      kycStatus: "not_started",
      arcoinPoints: 100,
    });
    [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
  }

  const token = randomBytes(32).toString("hex");
  res.json({
    userId: user!.id,
    email: user!.email,
    walletAddress: user!.walletAddress,
    loginMethod: "email",
    token,
  });
});

// POST /auth/wallet/login
router.post("/auth/wallet/login", async (req, res) => {
  const { walletAddress, signature, chainId } = req.body;
  if (!walletAddress) return res.status(400).json({ error: "Wallet address required" });

  let [user] = await db.select().from(usersTable).where(eq(usersTable.walletAddress, walletAddress)).limit(1);

  if (!user) {
    const id = randomUUID();
    await db.insert(usersTable).values({
      id,
      walletAddress,
      loginMethod: "wallet",
      tier: "bronze",
      kycStatus: "not_started",
      arcoinPoints: 50,
    });
    [user] = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
  }

  const token = randomBytes(32).toString("hex");
  res.json({
    userId: user!.id,
    email: user!.email,
    walletAddress: user!.walletAddress,
    loginMethod: "wallet",
    token,
  });
});

// POST /auth/logout
router.post("/auth/logout", (req, res) => {
  res.json({ message: "Logged out successfully", success: true });
});

// GET /auth/me - returns a mock user for demo purposes
router.get("/auth/me", async (req, res) => {
  const [user] = await db.select().from(usersTable).limit(1);
  if (!user) {
    return res.json({
      id: "demo-user",
      email: "demo@arcoin.finance",
      walletAddress: "0x742d35Cc6634C0532925a3b8D4C9e7a3c8E2f1a9",
      loginMethod: "wallet",
      tier: "gold",
      kycStatus: "approved",
      createdAt: new Date().toISOString(),
      arcoinPoints: 4250,
    });
  }
  res.json({ ...user, createdAt: user.createdAt.toISOString() });
});

export default router;
