import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { chatService } from "./chat.service";
import catchAsync from "../../utils/catchAsync";
import sendError from "../../utils/sendError";
import { JWT_SECRET_KEY } from "../../config";
import httpStatus from "http-status";


const createMessage = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {


    const payload = req.body;

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendError(res, httpStatus.UNAUTHORIZED, {
            message: "No token provided or invalid format.",
        });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };
    const senderId = decoded.id;


    // Validate payload
    if (!payload.senderId || !payload.receiverId || !payload.text) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'Invalid payload',
        });
        return next();
    }

    // Save message to DB
    const message = await chatService.createMessageFromBD(payload);
    if (!message) {
        throw new Error("Message was not sent");
    }

    const eventName = "new-message";
    const messageEvent = `${eventName}::${payload.receiverId}`;

    // Emit event to Socket.IO
    // @ts-ignore
    io.emit(messageEvent, {
        success: true,
        statusCode: 200,
        message: 'Message sent successfully',
        data: message,
    });

    // Emit notification to the receiver
    const receiverSocketId = payload.receiverId;
    const eventNameNotification = "new-notifiaction";
    const notificationEvent = `${eventNameNotification}::${receiverSocketId}`;
    // @ts-ignore
    io.emit(notificationEvent, {
        from: payload.senderId,
        message,
        timestamp: new Date().toISOString(),
    });

    // Respond to the client
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Message sent successfully',
        data: message,
    });

})



const getMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId1, userId2 } = req.body;

        const message = await chatService.getUserSeparateMessageFromDB(userId1, userId2);

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "This User's all message  Successfully",
            data: message
        });
    } catch (error) {
        next(error)
    }
};

export const chatController = {
    createMessage,
    getMessage
}