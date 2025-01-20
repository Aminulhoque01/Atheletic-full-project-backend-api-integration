import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IMatch } from "./match.interface";
import httpStatus from "http-status";
import { MatchService } from "./match.service";


const createMatch = catchAsync(async (req: Request, res: Response) => {
    const { fighter1Id, fighter2Id, movements, others, eventId } = req.body;

    if (!fighter1Id || !fighter2Id || !movements || !others) {
        throw new Error("Missing required fields: fighter1Id, fighter2Id, movements, or others.");
    }

    const match = await MatchService.createMatch(eventId, fighter1Id, fighter2Id, movements, others);

    sendResponse<IMatch>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Match created successfully.",
        data: match,
    });
});





const getMatch = catchAsync(async (req: Request, res: Response) => {
    const { matchId } = req.body;

    if (!matchId) {
        throw new Error("Match ID is required.");
    }

    const match = await MatchService.getMatch(matchId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Match retrieved successfully.",
        data: match,
    });
});


const getWinnerList = catchAsync(async (req: Request, res: Response) => {

    const winners = await MatchService.allwinner();

    if (winners.length === 0) {
        throw new Error('winner not found');
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Winners retrieved successfully",
        data: winners,
    });
});





export const MatchConroller = {
    createMatch,
    getMatch,
    getWinnerList
}