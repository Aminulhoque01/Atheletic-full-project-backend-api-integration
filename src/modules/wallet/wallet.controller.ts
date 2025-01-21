import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { WalletService } from "./wallet.service";
import { ObjectId } from "mongodb";
import { IWallet } from "./wallet.interface";
import { Request, Response } from "express";
import { JWT_SECRET_KEY } from "../../config";
import jwt from "jsonwebtoken";
import sendError from "../../utils/sendError";


const getWallet = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { managerId } = req.body;

    // Validate userId presence
    if (!managerId) {
       throw new Error("userId is required in the request body",)
    }

    // Fetch the wallet
    const wallet = await WalletService.getWallets(managerId);
    if (!wallet) {
        throw new Error("Wallet not found. Please ensure the userId is correct.")
    }

    // Send the response
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Wallet retrieved successfully",
        data: wallet,
    });
});



const addWidthdowal = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { userId, amount } = req.body;
    const wallet = await WalletService.addWithdrawal(userId, amount);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " wallet add successfully",
        data: wallet,
    })
});


const createWidthdowalRequest = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { bankName, accountType, accountNumber, withdrawalAmount, managerId } = req.body;
    const wallet = await WalletService.createWithdrawalRequest(managerId, {
        bankName,
        accountType,
        accountNumber,
        withdrawalAmount,
        status: "pending",
        managerId: new ObjectId,
        amount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " widthdowal Request  successfully",
        data: wallet,
    })
});


const updateWidthdowalRequest = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { requestId, status } = req.body;
    const wallet = await WalletService.updateWithdrawalRequest(
        req.params.managerId,
        requestId,
        status
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " update widthdowal Request  successfully",
        data: wallet,
    })
});


const createWallet = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendError(res, httpStatus.UNAUTHORIZED, {
            message: "No token provided or invalid format.",
        });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as {
        id: string;
    };
    const managerId = decoded.id;

    const wallet = await WalletService.createWallet(managerId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "  wallet create  successfully",
        data: wallet,
    })
})




export const WalletController = {
    getWallet,
    addWidthdowal,
    createWidthdowalRequest,
    updateWidthdowalRequest,
    createWallet
}