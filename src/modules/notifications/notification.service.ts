import { INotification, } from "./notification.interface";
import { Notification } from "./notification.model";

const createNotification = async(
    recipientType: 'EventManager' | 'Fighter' | 'Admin',
    recipientId: string,
    message: string
): Promise<INotification> => {
    const notification = new Notification({ recipientType, recipientId, message });
    return await notification.save();
}

const getNotification = async(recipientType: string, recipientId: string): Promise<INotification[]> => {
    return await Notification.find({ recipientType, recipientId }).sort({ createdAt: -1 }).exec();
}

export const notificationService = {
    createNotification,
    getNotification
}