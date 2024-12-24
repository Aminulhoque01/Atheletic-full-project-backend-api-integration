import express from "express";

import { adminMiddleware } from "../../middlewares/auth";
import { createTerms, getAllTerms, updateTerms } from "./Terms.controller";

const router = express.Router();
router.post("/create", adminMiddleware("admin"), createTerms);
router.get("/", getAllTerms);
router.patch("/update", updateTerms);

export const TermsRoutes = router;
