import express from "express";
import { notificationController } from "./notification.controller";
// import { getMyNotification } from "./notification.controller";

const router = express.Router();

router.get("/", notificationController.getNotification);

router.post('/send-notification', notificationController.createNotification);

export const NotificationRoutes = router;
