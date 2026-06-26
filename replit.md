# ARCOIN — Web3 Financial Super-App

A full-stack Web3 financial super-app built on the Arc Network (Chain ID 5042002, USDC-native). ARCOIN gives elite operators a single interface for payments, treasury, DeFi, AI agents, governance, invoice financing, compliance, and savings.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API server (port 8080, path `/api`)
- `pnpm --filter @workspace/arcoin run dev` — React frontend (port 18369, path `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — session signing key

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite, Wouter router, @tanstack/react-query, Framer Motion, Recharts, shadcn/ui, Tailwind dark theme
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Smart contracts: Solidity 0.8.20 (StreamingPayout, ArcFlowInvoice, OwnerWallet, AutonomousAgent)

## Where things live

- `lib/db/src/schema/index.ts` — DB schema (source of truth)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for all endpoints)
- `lib/api-client-react/src/generated/` — generated React Query hooks + Zod schemas
- `artifacts/api-server/src/routes/` — all Express route handlers
- `artifacts/arcoin/src/pages/` — all 17 frontend pages
- `artifacts/arcoin/src/components/Layout.tsx` — sidebar nav
- `contracts/` — Solidity smart contracts

## Architecture decisions

- All blockchain interactions are simulated (mock data) — real integration requires CIRCLE_API_KEY and Chainalysis/TRM Labs keys.
- Session auth with express-session; demo user auto-seeded (`demo@arcoin.finance`, wallet `0x742d35Cc6634C0532925a3b8D4C9e7a3c8E2f1a9`).
- Vault routes also handle loyalty points (`/points/*`) since they share the same DB models.
- OpenAPI-first: always update `openapi.yaml` first, run codegen, then implement routes and use generated hooks on the frontend.
- Smart contracts use OpenZeppelin v5 primitives (ReentrancyGuard, Ownable, Pausable).

## Product — 8 Pillars / 31 Features

1. **Payments & Streaming** — Send, Receive, Swap, Bridge, real-time USDC streaming
2. **Treasury** — multi-currency holdings, analytics, bulk payouts, yield optimization
3. **AI Assistant** — GPT-powered financial advisor, document analysis, scenario modeling
4. **Governance & Multisig** — DAO proposals, voting, M-of-N multisig transaction approval
5. **ArcFlow (Invoice Financing)** — tokenized invoice NFTs, marketplace, instant liquidity
6. **Compliance** — AML/KYC screening, transaction monitoring, risk scoring, sanctions checks
7. **Savings Vault** — goal-based USDC savings, yield tracking, loyalty points system
8. **Admin Analytics** — user metrics, revenue, transaction volume, compliance dashboard

## User preferences

- React+Vite only (no Next.js)
- Full dark Web3 UI throughout
- Arc Network: Chain ID 5042002, RPC https://rpc.testnet.arc.network

## Gotchas

- `Safe` is not a valid lucide-react icon — use `Lock` instead.
- `SiMetamask`/`SiCoinbase` are not exported by `react-icons/si` — use inline divs.
- Do not run `pnpm dev` at workspace root; use `restart_workflow` or per-package commands.
- Always run codegen after changing `openapi.yaml`: `pnpm --filter @workspace/api-spec run codegen`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
