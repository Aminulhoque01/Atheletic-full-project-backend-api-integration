import { Router } from "express";
import { withdrawController } from "./withdraw.controller";
import { adminMiddleware } from "../../middlewares/auth";

const router= Router();

router.post("/send-withdraw", adminMiddleware("eventManager"), withdrawController.sendWithdrawalRequest);
router.get("/withdraw-request", adminMiddleware("admin"), withdrawController.getWithdrawRequest);

export const withdrawRouter = router;