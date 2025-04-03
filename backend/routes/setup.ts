import { Router } from "express";
import { populateDB, setUpDB } from "../controllers/setup";

const router = Router();

router.use("/db", setUpDB);
router.use("/populate", populateDB);

export default router;
