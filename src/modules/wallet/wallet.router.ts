import { Router } from "express";
import { WalletController } from "./wallet.controller";
import { adminMiddleware } from "../../middlewares/auth";

const router= Router();

router.post("/create-wallet", adminMiddleware("eventManager"), WalletController.createWallet)
router.get("/get-wallet", WalletController.getWallet);
router.post("/add-widthdowal", WalletController.addWidthdowal);

router.post("/add-wallet", WalletController.createWidthdowalRequest);




export const WalletRoutes= router