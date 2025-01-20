import { Schema } from "mongoose";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserModel } from "../user/user.model";


interface FightCard {
  participant1: Schema.Types.ObjectId;
  participant2: Schema.Types.ObjectId;
  status?: string;
  score?: number;
}

export interface ITournament extends Document {
  eventID: string;
  fightCards:FightCard[];
  createdAt?: Date;
}

export interface IWallet extends Document {
  managerId: Schema.Types.ObjectId;
  totalEarnings: number;
  withdrawalRequests: {
    bankName: string;
    accountType: string;
    accountNumber: string;
    withdrawalAmount: number;
    status: "pending" | "completed";
  }[];
}
