import mongoose, { Schema } from "mongoose";
import { ISupportEmail } from "./support.interface";

const SupportEmailSchema = new Schema<ISupportEmail>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref:"fighter" },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const SupportEmailModel = mongoose.model<ISupportEmail>("SupportEmail", SupportEmailSchema);