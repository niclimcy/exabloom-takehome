import { Router } from "express";
import { populateDB, setUpDB } from "../controllers/setup.controller";

const router = Router();

router.use("/db", setUpDB);
router.use("/populate", populateDB);

export default router;
