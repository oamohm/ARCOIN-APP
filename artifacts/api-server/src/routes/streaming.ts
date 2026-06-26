import { Router } from "express";
import { db } from "@workspace/db";
import { streamingJobsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

function serializeJob(job: typeof streamingJobsTable.$inferSelect) {
  return {
    ...job,
    totalAmount: parseFloat(job.totalAmount),
    disbursedAmount: parseFloat(job.disbursedAmount),
    recipients: JSON.parse(job.recipients),
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
}

// GET /streaming/jobs
router.get("/streaming/jobs", async (req, res) => {
  const jobs = await db.select().from(streamingJobsTable).orderBy(streamingJobsTable.createdAt);
  res.json(jobs.map(serializeJob));
});

// POST /streaming/jobs
router.post("/streaming/jobs", async (req, res) => {
  const { name, currency, chain, recipients } = req.body;
  if (!name || !recipients?.length) return res.status(400).json({ error: "Name and recipients required" });

  const totalAmount = recipients.reduce((sum: number, r: { amount: number }) => sum + (r.amount || 0), 0);
  const id = randomUUID();

  await db.insert(streamingJobsTable).values({
    id,
    userId: "demo-user",
    name,
    status: "active",
    totalRecipients: recipients.length,
    completedCount: 0,
    failedCount: 0,
    totalAmount: totalAmount.toString(),
    disbursedAmount: "0",
    currency: currency || "USDC",
    chain: chain || "Arc",
    recipients: JSON.stringify(recipients),
    updatedAt: new Date(),
  });

  const [job] = await db.select().from(streamingJobsTable).where(eq(streamingJobsTable.id, id)).limit(1);
  res.status(201).json(serializeJob(job!));
});

// GET /streaming/jobs/:jobId
router.get("/streaming/jobs/:jobId", async (req, res) => {
  const [job] = await db.select().from(streamingJobsTable).where(eq(streamingJobsTable.id, req.params.jobId)).limit(1);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(serializeJob(job));
});

// POST /streaming/jobs/:jobId/pause
router.post("/streaming/jobs/:jobId/pause", async (req, res) => {
  await db.update(streamingJobsTable)
    .set({ status: "paused", updatedAt: new Date() })
    .where(eq(streamingJobsTable.id, req.params.jobId));
  const [job] = await db.select().from(streamingJobsTable).where(eq(streamingJobsTable.id, req.params.jobId)).limit(1);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(serializeJob(job));
});

// POST /streaming/jobs/:jobId/resume
router.post("/streaming/jobs/:jobId/resume", async (req, res) => {
  await db.update(streamingJobsTable)
    .set({ status: "active", updatedAt: new Date() })
    .where(eq(streamingJobsTable.id, req.params.jobId));
  const [job] = await db.select().from(streamingJobsTable).where(eq(streamingJobsTable.id, req.params.jobId)).limit(1);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(serializeJob(job));
});

// POST /streaming/jobs/:jobId/stop
router.post("/streaming/jobs/:jobId/stop", async (req, res) => {
  await db.update(streamingJobsTable)
    .set({ status: "stopped", updatedAt: new Date() })
    .where(eq(streamingJobsTable.id, req.params.jobId));
  const [job] = await db.select().from(streamingJobsTable).where(eq(streamingJobsTable.id, req.params.jobId)).limit(1);
  if (!job) return res.status(404).json({ error: "Job not found" });
  res.json(serializeJob(job));
});

export default router;
