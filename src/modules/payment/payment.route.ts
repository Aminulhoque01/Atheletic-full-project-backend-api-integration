import express from "express";
import { adminMiddleware } from "../../middlewares/auth";
import { getAllAmount, getAllPayments, getTodayAmount, paymentCreate } from "./payment.controller";

const router = express.Router();

router.post("/", adminMiddleware(["fighter","eventManager"]), paymentCreate);
router.get("/history", adminMiddleware("admin"), getAllPayments);
router.get("/total-amount", adminMiddleware("admin"), getAllAmount);
router.get("/today-amount", adminMiddleware("admin"), getTodayAmount);

export const paymentRoutes = router;

