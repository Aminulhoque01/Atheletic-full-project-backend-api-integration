// import mongoose, { Schema } from "mongoose";
// import { INotification } from "./notification.interface";

import mongoose, { Schema } from "mongoose";
import { INotification } from "./notification.interface";

// const NotificationSchema: Schema = new Schema(
//   {
//     userId: { type: Schema.Types.ObjectId, ref: "fighter", required: true },
//     eventManagerId: [{ type: Schema.Types.ObjectId, ref: "eventManager" }],
//     adminId: [{ type: Schema.Types.ObjectId, ref: "fighter",  }],
//     adminMsg: { type: String },
//     userMsg: { type: String },
//     eventManagerMsg: { type: String },
//   },
//   { timestamps: true },
// );

// export const NotificationModel = mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);





const NotificationSchema = new Schema<INotification>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  

  type: { type: String, required: true },
  role: { type: String, required: true },
  sendBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);