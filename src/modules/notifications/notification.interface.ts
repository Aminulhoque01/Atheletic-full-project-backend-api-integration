// import { Document, Types } from "mongoose";

import mongoose from "mongoose";

// // Define the INotification type
// export type INotification = {
//   userName?: string;
//   userId: Types.ObjectId;
//   eventManagerId: Types.ObjectId;
//   adminId?: Types.ObjectId[]; // Optional array of ObjectId
//   adminMsg: string;
//   userMsg: string;
//   eventManagerMsg: string;

// } & Document;




export type INotification ={
  recipientType: 'EventManager' | 'Fighter' | 'Admin';
  recipientId: mongoose.Types.ObjectId;
  adminId?: string[];

  adminMsg?: string;

  userMsg?: string;
  title: string;
  userId?: string;
  message: string;
  read: boolean;
  createdAt: Date;
}



