// import httpStatus from "http-status";

import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { notificationService } from "./notification.service";

// import jwt from "jsonwebtoken";

// import { Request, Response } from "express";
// import { findUserById } from "../user/user.service";
// import { NotificationModel } from "./notification.model";
// import catchAsync from "../../utils/catchAsync";
// import sendError from "../../utils/sendError";
// import sendResponse from "../../utils/sendResponse";




// export const getMyNotification = catchAsync(
//   async (req: Request, res: Response) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return sendError(res, httpStatus.UNAUTHORIZED, {
//         message: "No token provided or invalid format.",
//       });
//     }

//     const token = authHeader.split(" ")[1];
//     try {
//       const decoded = jwt.verify(
//         token,
//         process.env.JWT_SECRET_KEY as string
//       ) as { id: string; userName: string };
//       const userId = decoded.id;

//       const user = await findUserById(userId);
//       if (!user) {
//         return sendError(res, httpStatus.NOT_FOUND, {
//           message: "User not found.",
//         });
//       }

//       const page = parseInt(req.query.page as string, 10) || 1;
//       const limit = parseInt(req.query.limit as string, 10) || 20;
//       const skip = (page - 1) * limit;

//       let notifications = [];
//       let totalNotifications = 0;

//       if (user.role === "admin") {
//         notifications = await NotificationModel.find({
//           adminMsg: { $exists: true },
//         })
//           .select("adminMsg createdAt updatedAt userId userName")
//           .sort({ createdAt: -1 })
//           .skip(skip)
//           .limit(limit);

//         totalNotifications = await NotificationModel.countDocuments({
//           adminMsg: { $exists: true },
//         });
//       } else if (user.role === "eventManager") {
//         notifications = await NotificationModel.find({
//           userId: userId,
//           eventManagerMsg: { $exists: true },
//         })
//           .select("userId userName eventManagerMsg createdAt updatedAt")
//           .sort({ createdAt: -1 })
//           .skip(skip)
//           .limit(limit);

//         totalNotifications = await NotificationModel.countDocuments({
//           userId: userId,
//           eventManagerMsg: { $exists: true },
//         });
//       } else if (user.role === "fighter") {
//         notifications = await NotificationModel.find({
//           userId: userId,
//           userMsg: { $exists: true },
//         })
//           .select("userId userName userMsg createdAt updatedAt")
//           .sort({ createdAt: -1 })
//           .skip(skip)
//           .limit(limit);

//         totalNotifications = await NotificationModel.countDocuments({
//           userId: userId,
//           userMsg: { $exists: true },
//         });
//       }

//       const totalPages = Math.ceil(totalNotifications / limit);
//       const formattedNotifications = notifications.map((notification) => ({
//         _id: notification._id,
//         userId: notification.userId,
//         msg:
//           user.role === "admin"
//             ? notification.adminMsg
//             : user.role === "eventManager"
//             ? notification.eventManagerMsg
//             : notification.userMsg,
//         createdAt: notification.createdAt,
//         updatedAt: notification.updatedAt,
//       }));

//       const prevPage = page > 1 ? page - 1 : null;
//       const nextPage = page < totalPages ? page + 1 : null;

//       sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Here is your notifications.",
//         data: {
//           notifications: formattedNotifications,
//           pagination: {
//             totalPages,
//             currentPage: page,
//             prevPage: prevPage ?? 1,
//             nextPage: nextPage ?? 1,
//             limit,
//             totalNotifications,
//           },
//         },
//       });
//     } catch (error) {
//       return sendError(res, httpStatus.UNAUTHORIZED, {
//         message: "Invalid token or token expired.",
//       });
//     }
//   }
// );





const createNotification = catchAsync(async (req: Request, res: Response) => {
  
  const { recipientType, recipientId, message } = req.body;
  const notification = await notificationService.createNotification(recipientType, recipientId, message);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Notification created successfully.",
    data: notification,
  });
});

const getNotification = catchAsync(async (req: Request, res: Response) => {
  // const { recipientType, recipientId } = req.query;
      const notifications = await notificationService.getNotification();
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Here are your notifications.",
        data: notifications,
      })
});

export const notificationController = {
  createNotification,
  getNotification
}