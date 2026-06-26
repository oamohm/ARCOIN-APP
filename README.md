# ARCOIN — Web3 Financial Super-App

> **The Global Financial Operating System** — built on Arc Network (Chain ID 5042002), powered by Circle USDC.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/oamohm/ARCOIN-APP)

---

## 🚀 All 31 Features

| # | Feature | Status |
|---|---------|--------|
| 1 | Welcome Popup (Framer Motion) | ✅ |
| 2 | Arc/Circle Network Info | ✅ |
| 3 | Wallet Connect + Email OTP Login | ✅ |
| 4 | Email OTP Transaction Verify | ✅ |
| 5 | ARCOIN Points (Loyalty + Rewards) | ✅ |
| 6 | Thank You Popup | ✅ |
| 7 | Send / Receive / Withdraw USDC | ✅ |
| 8 | Bulk Streaming (CSV/Excel) | ✅ |
| 9 | Pause / Resume / Stop Streaming | ✅ |
| 10 | Cross-Border FX (USDC → EURC/BRLA/JPYC) | ✅ |
| 11 | Treasury Dashboard (Report Card + Audit) | ✅ |
| 12 | ArcScan Verified (Memo) | ✅ |
| 13 | Multi-chain Unified Treasury | ✅ |
| 14 | AI-Powered Financial Assistant | ✅ |
| 15 | Enterprise Payroll + Compliance (KYC/AML) | ✅ |
| 16 | On-chain Governance + Multisig (DAO) | ✅ |
| 17 | Regulatory Shield (Chainalysis/TRM Labs) | ✅ |
| 18 | Privacy Shield (ZK-Proof + View Keys) | ✅ |
| 19 | Trust Shield (On-chain Dispute Resolution) | ✅ |
| 20 | Institutional Shield (Bank-Grade Treasury) | ✅ |
| 21 | Autonomous Financial Agent (Auto-Save, Tax) | ✅ |
| 22 | Swap (USDC → EURC/JPYC) | ✅ |
| 23 | Bridge (USDC → Ethereum, Solana, Polygon) | ✅ |
| 24 | ARCOIN Breath (Guided Breathing + Mood Report) | ✅ |
| 25 | ARCOIN Vault (Goal-based Savings + Auto-Saving) | ✅ |
| 26 | Owner Wallet (Admin Controlled) | ✅ |
| 27 | Live User Analytics (Admin Panel) | ✅ |
| 28 | Arc-Flow: Invoice Generation (NFT-Invoiced) | ✅ |
| 29 | Arc-Flow: Liquidity Marketplace | ✅ |
| 30 | Arc-Flow: Instant Payout (USDC) | ✅ |
| 31 | Arc-Flow: Investor Dashboard | ✅ |

---

## 🛠 Tech Stack

- **Frontend:** React 19 + Vite, Wouter, @tanstack/react-query, Framer Motion, Recharts, shadcn/ui, Tailwind CSS (dark)
- **Backend:** Express 5, Node.js 24, TypeScript 5.9
- **Database:** PostgreSQL + Drizzle ORM
- **API:** OpenAPI 3.0 spec → Orval codegen (React Query hooks + Zod schemas)
- **Smart Contracts:** Solidity 0.8.20, OpenZeppelin v5 (ReentrancyGuard, Ownable, Pausable)
- **Network:** Arc Network · Chain ID 5042002 · Circle USDC-native
- **Compliance:** Chainalysis / TRM Labs API (AML/KYC), FATF Travel Rule, MiCAR, GDPR

## 📁 Smart Contracts

| Contract | Description |
|----------|-------------|
| `StreamingPayout.sol` | Real-time USDC streaming with pause/resume/stop |
| `ArcFlowInvoice.sol` | ERC-721 invoice NFT with built-in liquidity marketplace |
| `OwnerWallet.sol` | Platform fee collection + admin treasury |
| `AutonomousAgent.sol` | On-chain autonomous financial agent (auto-save, bill pay) |

---

## 🔧 Local Development

```bash
# Install dependencies
pnpm install

# Start API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Start frontend (port 18369)
pnpm --filter @workspace/arcoin run dev

# Push DB schema
pnpm --filter @workspace/db run push

# Regenerate API hooks from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen
```

## 🌍 Environment Variables

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your-32-char-secret
CIRCLE_API_KEY=your-circle-api-key
VITE_ARC_CHAIN_ID=5042002
VITE_ARC_RPC=https://rpc.testnet.arc.network
```

## 🚀 Deploy on Vercel

1. Fork this repo
2. Connect to [Vercel](https://vercel.com/new)
3. Set environment variables above
4. Deploy — done!

---

## 🔐 Security

- OpenZeppelin formal verification on all contracts
- ReentrancyGuard on all value-transfer functions
- Ownable with 2-step ownership transfer
- Chainalysis / TRM Labs real-time AML screening
- FATF Travel Rule compliance engine
- Multi-sig (M-of-N) for treasury operations
- ZK-proof privacy shield (opt-in)

---

*ARCOIN is a demo/prototype. Not financial advice. Smart contracts are unaudited.*
