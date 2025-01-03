import mongoose from "mongoose";
import { Notification } from "../modules/notifications/notification.model";
import { UserModel } from "../modules/user/user.model";
interface SendNotificationParams {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  userMsg: string;
  role: string;
  type: string;
  sendBy: mongoose.Types.ObjectId;
}

interface FCMMessage {
  token: string;
  notification: {
    title: string;
    body: string;
  };
  data: {
    linkId: mongoose.Types.ObjectId;
    type: string;
  };
}

const sendNotification = async ({
  userId,
  title,
  role,
  type,
  sendBy,

  message,
  userMsg,
 
}: SendNotificationParams): Promise<Notification> => {
  try {
    const notification = (await Notification.create({
      userId,
      title,
      message,
      
      read: false,
      userMsg,
      role,
      type,
      sendBy,
    })) as unknown as Notification;

    // Fetch the receiver's FCM token (assuming it's stored in the User model)
    const receiver = await UserModel.findById(userId);
    if (receiver) {
      // Send push notification via FCM
        const fcmMessage: FCMMessage = {
            token: receiver.fcmToken,
            notification: {
            title,
            body:message,
            },
            data: {
            linkId: userId || "",
            type: type || "general",
            }, // Optional metadata as data payload
        };  

      await admin.messaging().send(fcmMessage);
    }

    return notification;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};

export default sendNotification;
