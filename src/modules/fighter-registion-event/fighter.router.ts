import { Router } from "express";
import { FighterController } from "./fighter.controller";
import { adminMiddleware } from "../../middlewares/auth";

const router= Router();

router.post('/register', adminMiddleware('fighter'), FighterController.registerFighter);
router.post('/event-register',adminMiddleware('fighter'), FighterController.registerForEvent);

export const FighterRoutes = router;