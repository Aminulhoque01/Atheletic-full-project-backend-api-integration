import { Router } from "express";
import { EventRequestController } from "./eventRequest.controller";
import { adminMiddleware } from "../../middlewares/auth";

const router = Router();

router.post('/send', adminMiddleware("fighter"), EventRequestController.createEventRequest);
router.get('/', adminMiddleware("eventManager"), EventRequestController.getRequestsForEvent);
router.get('/fighter', adminMiddleware("eventManager"), EventRequestController.getRequestsForFighter);
router.patch('/updateStatus', adminMiddleware("eventManager"), EventRequestController.updateRequestStatus);
router.get('/all-request', adminMiddleware("eventManager"), EventRequestController.getAllRequests);

export const EventRequestRoutes = router;