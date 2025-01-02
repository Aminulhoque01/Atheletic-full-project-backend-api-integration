import mongoose, { Schema, Model } from "mongoose";
import { ISubscription } from "./subscription.interface";

const subscriptionSchema: Schema<ISubscription> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    tier: {
      type: String,
      // required: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    feature: {
      type: [String],
      default: [
        "Unlimited Product updates",
        "Unlimited Product updates",
        "Unlimited Product updates",
        "demo reminders",
        "Email and community support"
      ],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export const SubscriptionModel: Model<ISubscription> =mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", subscriptionSchema);
