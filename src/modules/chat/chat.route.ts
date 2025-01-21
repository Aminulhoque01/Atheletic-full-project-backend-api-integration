import  express  from "express";

import { messageValidatio } from "./chat.validation";
// import { chatController } from "./chat.controller";
import validateRequest from "../../middlewares/validateRequest";
import { chatController } from "./chat.controller";
import { adminMiddleware } from "../../middlewares/auth";




const router = express.Router()

router.post(
    '/send-message',
    
    validateRequest(messageValidatio.MessageVallidationmSchema),
    chatController.createMessage
)
router.get(
    '/messages',
    // auth( USER_ROLE.admin, USER_ROLE.user, USER_ROLE.super_admin),
    adminMiddleware(["admin","fighter"]),
    chatController.getMessage
)

export const messageRoutes = router;