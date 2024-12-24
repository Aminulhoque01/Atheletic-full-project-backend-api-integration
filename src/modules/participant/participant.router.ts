import { Router } from "express";
import { ParticipantController } from "./participant.controller";
import { adminMiddleware } from "../../middlewares/auth";

const router = Router();


router.post("/create", ParticipantController.createParticipant);
router.post("/fight-card", ParticipantController.addFighterCard);
router.get("/participants", adminMiddleware("admin"), ParticipantController.fetchParticipant);

export const ParticipantRouter = router;