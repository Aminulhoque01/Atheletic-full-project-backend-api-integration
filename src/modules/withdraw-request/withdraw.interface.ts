import mongoose from "mongoose";

export type IWithdrawalRequest = {
    managerId: mongoose.Types.ObjectId;
    amount: number;
    status: "pending" | "approved" | "rejected";
    createdAt: Date;
    updatedAt: Date;
}