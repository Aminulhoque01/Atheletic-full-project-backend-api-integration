import { Types } from "mongoose";


export interface ISupportEmail {
    userId:Types.ObjectId; // Reference to the user sending the support email
    email: string; // Email address of the sender
    subject: string; // Subject of the email
    message: string; // Email body/message
    createdAt: Date; // Timestamp for when the email was created
}