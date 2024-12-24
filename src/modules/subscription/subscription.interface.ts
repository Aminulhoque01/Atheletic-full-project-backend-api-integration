import { Document } from "mongoose";

export type ISubscription = {
  name: string;
  tier: "basic" | "advanced";
  features: string[];
  price: string;
  duration: string;
  feature: {
    subscription_date: string;
    subscription_end_date: string;
    subscription_status: string;
  };
  isDeleted: boolean;
} & Document;
