import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import walletRouter from "./wallet";
import transactionsRouter from "./transactions";
import streamingRouter from "./streaming";
import treasuryRouter from "./treasury";
import governanceRouter from "./governance";
import arcflowRouter from "./arcflow";
import aiRouter from "./ai";
import vaultRouter from "./vault";
import adminRouter from "./admin";
import complianceRouter from "./compliance";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(walletRouter);
router.use(transactionsRouter);
router.use(streamingRouter);
router.use(treasuryRouter);
router.use(governanceRouter);
router.use(arcflowRouter);
router.use(aiRouter);
router.use(vaultRouter);
router.use(adminRouter);
router.use(complianceRouter);

export default router;
