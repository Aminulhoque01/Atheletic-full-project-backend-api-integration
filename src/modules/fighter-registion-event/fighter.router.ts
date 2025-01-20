import { Router } from "express";
import { FighterController } from "./fighter.controller";
import { adminMiddleware } from "../../middlewares/auth";

const router= Router();

router.post('/event-register', adminMiddleware(['fighter',"eventManager"]), FighterController.registerFighter);
router.get('/registion-pepole', adminMiddleware('eventManager'), FighterController.getEventRegistrations);

router.get('/tournament', FighterController.getAllTournament);

export const FighterRoutes = router;