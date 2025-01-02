import { Document } from "mongoose";

export type ISubscription = {
  name: string;
  // tier: "basic" | "advanced";
  tier: string;
  // features: string[];
  price: string;
  duration: string;

  feature: [
    "Unlimited Product updates",
    "Unlimited Product updates",
    "Unlimited Product updates",
    "demo reminders",
    "Email and community support"
  ],
  isDeleted: boolean;
} & Document;
