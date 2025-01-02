import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { withdrawRequestService } from "./widthdraw.service";


const sendWithdrawalRequest=catchAsync(async(req:Request,res:Response)=>{
    const { managerId, amount } = req.body;

    if (!managerId || !amount) {
      throw new Error("managerId and amount are required.");
    }
  
    const withdrawalRequest = await withdrawRequestService.sendWithdrawalRequest(managerId, amount);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Withdrawal request sent successfully",
        data:withdrawalRequest  
    });

});

const getWithdrawRequest = catchAsync(async (req: Request, res: Response) => {
    const { status } = req.query; 

    const withdrawalRequests = await withdrawRequestService.getAllWithdrawalRequests(status as string);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:"Withdrawal requests fetched successfully",
        data:withdrawalRequests[0]
    })
});


export const withdrawController={
    sendWithdrawalRequest,
    getWithdrawRequest
}