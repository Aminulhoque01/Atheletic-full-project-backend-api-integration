import mongoose, { model, Schema } from "mongoose";
import { IWallet, Withdrawal } from "./wallet.interface";



const WalletSchema = new Schema<IWallet>(
    {
      managerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      totalEarnings: { type: Number, default: 0 },
      withdrawalRequests: [
        {
          bankName: { type: String, required: true },
          accountType: { type: String, required: true },
          accountNumber: { type: String, required: true },
          withdrawalAmount: { type: Number, required: true },
          status: { type: String, enum: ["pending", "completed"], default: "pending" },
        },
      ],
    },
    { timestamps: true }
  );
  

export const Wallet = model<IWallet>("Wallet", WalletSchema);

