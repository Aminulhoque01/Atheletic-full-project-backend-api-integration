import { INotification, } from "./notification.interface";
import { NotificationModel } from "./notification.model";
// import { Notification } from "./notification.model";

const createNotification = async(
    recipientType: 'EventManager' | 'Fighter' | 'Admin',
    recipientId: string,
    message: string
): Promise<INotification> => {
    const notification = new NotificationModel({ recipientType, recipientId, message });
    return await notification.save();
}

const getNotification = async(): Promise<INotification[]> => {
    return await NotificationModel.find().sort({ createdAt: -1 }).exec();
}

export const notificationService = {
    createNotification,
    getNotification
}