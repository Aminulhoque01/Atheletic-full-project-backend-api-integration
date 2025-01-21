// import { IWithdrawalRequest } from "../withdraw-request/withdraw.interface";
import mongoose from "mongoose";
import { IWithdrawalRequest } from "../withdraw-request/withdraw.interface";
import { IWallet } from "./wallet.interface";
import { Wallet } from "./wallet.model";
// import { wallet } from "./wallet.model";


const getWallets = async (managerId: string): Promise<IWallet | null> => {
    // Validate if userId is a valid ObjectId
    if (!mongoose.isValidObjectId(managerId)) {
        throw new Error("Invalid userId format");
    }

    // Query the wallet by managerId (or _id, based on your schema)
    return Wallet.findOne({ managerId: managerId }); // Update this if querying by _id
};


const addWithdrawal = async (managerId: string, amount: number): Promise<IWallet | null> => {
    if (typeof amount !== "number" || isNaN(amount)) {
        throw new Error("Invalid amount provided. It must be a valid number.");
    }

    const wallet = await Wallet.findOne({ managerId });
    if (!wallet) {
        throw new Error("Wallet not found.");
    }

    // Safely update totalEarnings
    wallet.totalEarnings = wallet.totalEarnings || 0; // Ensure it's initialized
    wallet.totalEarnings += amount;

    await wallet.save();
    return wallet;
};


const createWithdrawalRequest = async (
    managerId: string,
    withdrawalRequest: IWithdrawalRequest
): Promise<IWallet | null> => {
    const wallet = await Wallet.findOne({ managerId });
    if (!wallet) throw new Error("Wallet not found");

    // Use Mongoose to validate and create the subdocument
    const withdrawal = {
        _id: new mongoose.Types.ObjectId().toString(),
        bankName: withdrawalRequest.bankName,
        accountType: withdrawalRequest.accountType,
        accountNumber: withdrawalRequest.accountNumber,
        withdrawalAmount: withdrawalRequest.withdrawalAmount,
        status: withdrawalRequest.status as "pending" | "completed",
        createdAt: new Date(),
        updatedAt: new Date()
    };
    wallet.withdrawalRequests.push(withdrawal);

    // Save the wallet with the new withdrawal request
    await wallet.save();

    return wallet;
};

const updateWithdrawalRequest = async (managerId: string, requestId: string, status: "pending" | "completed"): Promise<IWallet | null> => {
    const wallet = await Wallet.findOne({ managerId });
    if (!wallet) throw new Error("Wallet not found");

    const withdrawal = wallet.withdrawalRequests.find(request => request._id === requestId);
    if (!withdrawal) throw new Error("Withdrawal request not found");

    withdrawal.status = status;
    await wallet.save();

    return wallet;
};


const createWallet = async (managerId: string): Promise<IWallet | null> => {
    const existingWallet = await Wallet.findOne({ managerId });
    if (existingWallet) {
        throw new Error("Wallet already exists for this manager");
    }

    // Create a new wallet
    const wallet = new Wallet({
        managerId,
        totalEarnings: 0, // Default to 0
        withdrawalRequests: [], // No withdrawal requests initially
    });

    await wallet.save();
    return wallet;

}




export const WalletService = {
    getWallets,
    addWithdrawal,
    createWithdrawalRequest,
    updateWithdrawalRequest,
    createWallet
}