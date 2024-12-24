import express from "express";
import { adminMiddleware } from "../../middlewares/auth";
import { getFeedback, giveFeedback } from "./feedback.controller";

const router = express.Router();

router.post("/give", giveFeedback);
router.get("/", adminMiddleware("admin"), getFeedback);

export const feedBackRoutes = router;
