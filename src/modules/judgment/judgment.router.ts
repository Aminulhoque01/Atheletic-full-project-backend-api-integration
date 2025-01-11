import { Router } from "express";
import { judgmentController } from "./judgment.controller";


const router= Router();

router.patch('/upload-score', judgmentController.uploadScores);

export const JudgmentRoutes = router;