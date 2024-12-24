import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IFighter } from "./fighter.interface";
import httpStatus from "http-status";
import { FighterService } from "./fighter.service";
import { Error } from "mongoose";


const registerFighter = catchAsync(async(req:Request, res:Response)=>{
    // const fighter = req.body;
    // const { name, email, discipline, age, weight } = req.body;
    const fighter = req.body;
    const result = await FighterService.createFighter(fighter);

    if (!result) {
       
        throw new Error("Failed to register fighter")
    }
    console.log(`Confirmation email sent to: ${fighter.email}`);

    sendResponse<IFighter>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Fighter registered successfully",
        data: result,
    });

});

const registerForEvent = catchAsync(async(req:Request, res:Response)=>{
    const {fighterId, eventId} = req.body;
 

    if (!fighterId || !eventId) {
        throw new Error("fighterId and eventId are required.");
    }

    // Call the service method
    const fighter = await FighterService.registerForEvent(fighterId, eventId);

    if (!fighter) {
        throw new Error("Failed to register fighter for event. Either the fighter or event was not found, or the registration logic failed.");
    }
    

    sendResponse<IFighter>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Fighter registered successfully",
        data: fighter,
    });
    
});

export const FighterController = {
    registerFighter,
    registerForEvent
}