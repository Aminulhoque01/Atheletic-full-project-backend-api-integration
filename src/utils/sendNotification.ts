import { Notification } from "../modules/notifications/notification.model";
import { UserModel } from "../modules/user/user.model";

interface SendNotificationParams {
    userId: string;
    title: string;
    message: string;
    recipientType: string;
    recipientId: string;
    
  
    userMsg: string;
  
    adminMsg: string;
}

interface FCMMessage {
    token: string;
    notification: {
        title: string;
        body: string;
    };
    data: {
        linkId: string;
        type: string;
    };
}


const sendNotification = async ({
    userId,
    title,
    message,
    recipientType,
    recipientId,
}: SendNotificationParams): Promise<Notification> => {
    try {
        const notification = await Notification.create({
            userId,
            title,
            message,
            recipientType,
            recipientId,
            read: false,
        }) as unknown as Notification;

        // Fetch the receiver's FCM token (assuming it's stored in the User model)
        const receiver = await UserModel.findById(recipientId);
        if (receiver) {
            // Send push notification via FCM
            const fcmMessage: FCMMessage = {
                token: receiver.fcmToken,
                notification: {
                    title,
                    body: message,
                },
                data: {
                    linkId: recipientId || "",
                    type: recipientType || "general",
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