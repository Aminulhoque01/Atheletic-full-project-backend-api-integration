import { IMessage } from "./chat.interface";
import MessageModel from "./chat.model";


const createMessageFromBD = async(payload : IMessage) => {

    const result = await MessageModel.create(payload);
    if (!result) {
        throw new Error("Message is not created"); 
    }
    return result;

}


const getUserSeparateMessageFromDB = async (userId1: string, userId2: string) => {
    
      // Fetch messages between two users
      const messages = await MessageModel.find({
        $or: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      }).sort({ createdAt: 1 }); // Sort by time
  
      return messages; // Return the fetched messages
   
  };

export const chatService = {
    createMessageFromBD,
    getUserSeparateMessageFromDB
} 