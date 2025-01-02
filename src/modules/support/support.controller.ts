import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ISupportEmail } from "./support.interface";
import httpStatus from "http-status";
import { SupportEmailService } from "./support.service";

const postSupport = catchAsync(async(req:Request, res:Response)=>{
    const { userId, email, subject, message } = req.body;
    const supportEmail = await SupportEmailService.createSupportEmail(userId, email, subject, message);

    sendResponse<ISupportEmail>(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "Support email sent successfully",
        data: supportEmail
    })
})


const getEmail = catchAsync(async(req:Request, res:Response)=>{
    const email = await SupportEmailService.getEmail();

    // if(!email){
    //     throw new Error("Failed to fetch emails")
    // }

    sendResponse<ISupportEmail[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Emails fetched successfully",
        data: email
    })
});

export const SupportController = {
    postSupport,
    getEmail
}