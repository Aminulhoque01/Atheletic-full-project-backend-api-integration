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
      enum: ["basic", "advanced"],
      required: true,
    },
    features: {
      type: [String],
      required: true,
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
      type: String,
      default: {
        subscription_date: "1970-01-01",
        subscription_end_date: "1970-01-01",
        subscription_status: "inactive",
        subscription_details: "No subscription details available",
      },
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

export const SubscriptionModel: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", subscriptionSchema);
