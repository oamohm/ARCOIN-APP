import { Router } from "express";
import { randomUUID } from "crypto";
import { db } from "@workspace/db";
import { transactionsTable } from "@workspace/db";

const router = Router();

const MOCK_WALLET = "0x742d35Cc6634C0532925a3b8D4C9e7a3c8E2f1a9";

// GET /wallet/balance
router.get("/wallet/balance", async (req, res) => {
  res.json({
    walletAddress: MOCK_WALLET,
    totalUsdcBalance: 145230.50,
    totalUsdValue: 148950.75,
    chains: [
      { chain: "Arc", chainId: 5042002, usdc: 98450.00, nativeToken: 5.2, nativeSymbol: "ARC", usdValue: 98450.00 },
      { chain: "Ethereum", chainId: 1, usdc: 32100.50, nativeToken: 1.8, nativeSymbol: "ETH", usdValue: 35820.50 },
      { chain: "Solana", chainId: 101, usdc: 10500.00, nativeToken: 45.3, nativeSymbol: "SOL", usdValue: 10980.75 },
      { chain: "Polygon", chainId: 137, usdc: 4180.00, nativeToken: 2200.0, nativeSymbol: "MATIC", usdValue: 3699.50 },
    ],
    currencies: {
      USDC: 145230.50,
      EURC: 1250.00,
      JPYC: 500000,
      BRLA: 5000.00,
    },
  });
});

// POST /wallet/send
router.post("/wallet/send", async (req, res) => {
  const { toAddress, amount, currency, chain, memo } = req.body;
  if (!toAddress || !amount || !currency || !chain) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const txHash = `0x${randomUUID().replace(/-/g, "")}`;
  const explorerUrl = `https://scan.testnet.arc.network/tx/${txHash}`;

  await db.insert(transactionsTable).values({
    id: randomUUID(),
    txHash,
    userId: "demo-user",
    type: "send",
    status: "confirmed",
    amount: amount.toString(),
    currency,
    chain,
    fromAddress: MOCK_WALLET,
    toAddress,
    memo: memo || null,
    fee: "0.001",
    emailVerified: req.body.otp ? true : false,
    explorerUrl,
  });

  res.json({ txHash, status: "confirmed", amount, currency, chain, explorerUrl, estimatedTime: "~2s" });
});

// POST /wallet/swap
router.post("/wallet/swap", async (req, res) => {
  const { fromCurrency, toCurrency, amount } = req.body;
  const fxRates: Record<string, number> = { USDC: 1, EURC: 0.92, JPYC: 155.2, BRLA: 5.05, KRW1: 1320 };
  const txHash = `0x${randomUUID().replace(/-/g, "")}`;
  const explorerUrl = `https://scan.testnet.arc.network/tx/${txHash}`;
  const convertedAmount = (amount * (fxRates[toCurrency] || 1)).toFixed(6);

  res.json({ txHash, status: "confirmed", amount: parseFloat(convertedAmount), currency: toCurrency, chain: "Arc", explorerUrl, estimatedTime: "~5s" });
});

// POST /wallet/bridge
router.post("/wallet/bridge", async (req, res) => {
  const { fromChain, toChain, amount, destinationAddress } = req.body;
  const txHash = `0x${randomUUID().replace(/-/g, "")}`;
  const explorerUrl = `https://scan.testnet.arc.network/tx/${txHash}`;

  res.json({ txHash, status: "pending", amount, currency: "USDC", chain: toChain, explorerUrl, estimatedTime: "~15 min" });
});

// GET /wallet/receive-address
router.get("/wallet/receive-address", (req, res) => {
  res.json({
    address: MOCK_WALLET,
    chain: "Arc",
    qrData: `ethereum:${MOCK_WALLET}@5042002`,
  });
});

export default router;
