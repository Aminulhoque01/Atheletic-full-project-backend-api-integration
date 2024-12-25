import { Document } from "mongoose";

export type ISubscription = {
  name: string;
  // tier: "basic" | "advanced";
  tier: string;
  // features: string[];
  price: string;
  duration: string;

  feature: {
    subscription_date: string;
    subscription_end_date: string;
    subscription_status: string;
    subscription_details: string;
  };
  isDeleted: boolean;
} & Document;
