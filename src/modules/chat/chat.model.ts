import { Schema, model } from 'mongoose';
import { IMessage } from './chat.interface';
// Define the schema
const MessageSchema: Schema = new Schema(
    {
        senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the sender
        receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the receiver
        text: { type: String, required: true }, // The content of the message
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Create the model
const MessageModel = model<IMessage>('Message', MessageSchema);

export default MessageModel;