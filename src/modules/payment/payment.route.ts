import express from "express";
import { adminMiddleware } from "../../middlewares/auth";
import { getAllAmount, getAllPayment, getTodayAmount, paymentCreate } from "./payment.controller";

const router = express.Router();

router.post("/", adminMiddleware(["fighter","eventManager"]), paymentCreate);
router.get("/history", adminMiddleware("admin"), getAllPayment);
router.get("/total-amount", adminMiddleware("admin"), getAllAmount);
router.get("/today-amount", adminMiddleware("admin"), getTodayAmount);

export const paymentRoutes = router;

