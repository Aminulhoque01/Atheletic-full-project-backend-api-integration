import express from "express";
import { adminMiddleware } from "../../middlewares/auth";
import { getAllPayment, paymentCreate } from "./payment.controller";

const router = express.Router();

router.post("/", adminMiddleware("fighter"), adminMiddleware("eventManager"), paymentCreate);
router.get("/history", adminMiddleware("admin"), getAllPayment);

export const paymentRoutes = router;

