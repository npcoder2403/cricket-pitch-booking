import { Router } from "express";
import { listPitches, getPitch } from "./pitch.controller";

const router = Router();

router.get("/", listPitches);
router.get("/:id", getPitch);

export default router;
