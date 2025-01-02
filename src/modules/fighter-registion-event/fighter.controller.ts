import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IFighter } from "./fighter.interface";
import httpStatus from "http-status";
import { FighterService } from "./fighter.service";
import { Error } from "mongoose";
import sendError from "../../utils/sendError";
import { JWT_SECRET_KEY } from '../../config';
import { Event } from "../event/event.models";
import { Fighter } from "./fighter.model";


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
    

    const { fighterId, eventId,managerId, amount } = req.body;
 

    if (!fighterId || !eventId) {
        throw new Error("fighterId and eventId are required.");
    }

    // Call the service method
    const fighter = await FighterService.registerForEvent(fighterId, eventId,managerId,amount);

   
    
   
    
    if (!fighter) {
        throw new Error("Failed to register fighter for event. Either the fighter or event was not found, or the registration logic failed.");
    }
    // Optionally, update Event for tracking purposes
    await Event.findByIdAndUpdate(eventId, {
        $push: { registeredFighters: fighterId },
    });

    sendResponse<IFighter>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Fighter registered successfully",
        data: fighter,
    });
    
});


const getEventRegister = catchAsync(async(req:Request, res:Response)=>{
    
    const result = await FighterService.getEventRegister();

    if (!result) {
        throw new Error("Failed to get fighter registration details");
    }

    sendResponse<IFighter[]>(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "gel all event-register fighter  successfully",
        data: result,
    })

})

export const FighterController = {
    registerFighter,
    registerForEvent,
    getEventRegister
}