import { Router } from "express";
import {
  getRecentMessages,
  searchMessages,
} from "../controllers/message.controller";

const router = Router();

router.use("/recent", getRecentMessages);
router.use("/search", searchMessages);

export default router;
