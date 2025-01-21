import { Types } from "mongoose";

export interface IMessage {
    _id: Types.ObjectId
    senderId: string;
    receiverId: string;
    text: string;
}