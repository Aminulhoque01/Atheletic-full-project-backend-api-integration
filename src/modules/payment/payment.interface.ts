import { Document, Types } from "mongoose";

export type IPayment = {
  transactionId: string;
  userId: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  amount: number;
  paymentData: object;
  status: "completed" | "pending" | "failed";
  isDeleted: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any; // <-- Add createdAt field
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updatedAt?: any; // <-- Add updatedAt field
} & Document;

export type IPaymentResult = {
  transactionId: string;
  amount: number;
  userName: string;
  subscriptionName: string;
  createdAt: string;
};
