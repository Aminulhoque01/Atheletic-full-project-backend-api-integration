import { Document, Model, Types } from "mongoose";

export type IPayment = {
  transactionId: string;
  userId: Types.ObjectId;
  subscriptionId: Types.ObjectId;
  amount: number;
  paymentData: object;
  status: "completed" | "pending" | "failed";
  isDeleted: boolean;
  paymentType: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt?: any; // <-- Add createdAt field
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updatedAt?: any; // <-- Add updatedAt field
} & Document;

export type IPaymentResult = {
  transactionId: string;
  amount: number;
  userId: Types.ObjectId;
  status: "completed" | "pending" | "failed";
  userName: string;
  paymentType: string;
  subscriptionName: string;
  createdAt: string;
};


// export interface IPaymentModal extends Model<IPayment> {
//   paginate(
//     filters: Record<string, any>,
//     options: PaginateOptions
//   ): Promise<PaginateResult<IPayment>>;
// }