import express from "express";

import { adminMiddleware } from "../../middlewares/auth";
import {
  createPrivacy,
  getAllPrivacy,
  updatePrivacy,
} from "./Privacy.controller";

const router = express.Router();
router.post("/create", adminMiddleware("admin"), createPrivacy);
router.get("/", getAllPrivacy);
router.patch("/update", adminMiddleware("admin"), updatePrivacy);

export const PrivacyRoutes = router;
