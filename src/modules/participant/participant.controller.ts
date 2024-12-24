import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IFightCard, IParticipant } from "./participant.interface";
import httpStatus from "http-status";
import { ParticipantService } from "./participant.service";

const createParticipant = catchAsync(async (req: Request, res: Response) => {
    const participant = await ParticipantService.createParticipant(req.body);
    
    if (!participant) {
        throw new Error("Failed to register fighter");
    }

    sendResponse<IParticipant>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "create participant registered successfully",
        data: participant,
    });
});


const fetchParticipant = catchAsync(async (req: Request, res: Response) => {
  const participant = await ParticipantService.getAllParticipants();

  sendResponse<IParticipant[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "getAllParticipants successfully",
    data: participant,
  });
});

const addFighterCard = catchAsync(async(req:Request, res:Response)=>{
    const {participantId, eventDate}= req.body;
    const fighterCar = await ParticipantService.addFighterCard(participantId, eventDate);
    if(!fighterCar){
        throw new Error("Failed to register fighterCar for eventDate");
            
    }

    sendResponse<IFightCard>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " add FighterCard successfully",
        data: fighterCar,
    });
})

export const ParticipantController = {
    fetchParticipant,
    addFighterCard,
    createParticipant
}
