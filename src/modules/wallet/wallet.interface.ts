import { Schema } from "mongoose";

export interface Withdrawal {
    amount: number;
    status: 'Pending' | 'Completed';
    date: Date;
}



export interface IWallet extends Document {
    managerId: Schema.Types.ObjectId;
    totalEarnings: number;
    withdrawalRequests: {
        _id: string;
        bankName: string;
        accountType: string;
        accountNumber: string;
        withdrawalAmount: number;
        status: "pending" | "completed";
    }[];
}