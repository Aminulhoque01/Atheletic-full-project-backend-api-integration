
import express from "express";
import { adminMiddleware } from "../../middlewares/auth";
import {
  createSubscription,
  deleteSubscription,
  getSubscription,
  getUserSubscriptions,
  updateSubscription,
} from "./subscription.controller";
import { restorePromoCode } from "../promoCode/promoCode.controller";

const router = express.Router();

router.post("/create", adminMiddleware("admin"), createSubscription);
router.get("/", getSubscription);
router.post("/update", adminMiddleware("admin"), updateSubscription);
router.post("/delete", adminMiddleware("admin"), deleteSubscription);
router.get("/my", adminMiddleware("fighter"), getUserSubscriptions);
router.get("/my", adminMiddleware("eventManager"), getUserSubscriptions);
router.post('/restore', adminMiddleware("admin"), restorePromoCode);

export const subscriptionRoutes = router;
