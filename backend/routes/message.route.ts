import { Router } from "express";
import { getRecentMessages } from "../controllers/message.controller";

const router = Router();

router.use("/recent", getRecentMessages);

export default router;
