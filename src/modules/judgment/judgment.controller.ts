import httpStatus from "http-status";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { judgmentProfileService } from "./judgment.service";



export const uploadScores = catchAsync(async (req: Request, res: Response) => {
  const { eventId, scores } = req.body;

  if (!eventId || !scores) {
    throw new Error("eventId and scores are required");
  }

  const updatedEvent = await judgmentProfileService.EventService.uploadScores(
    eventId,
    scores
  );

  if (!updatedEvent) {
    throw new Error("Scores upload failed");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Scores uploaded successfully",
    data: updatedEvent,
  });
});


export const judgmentController = {
  // createJudgment,
  uploadScores,
};
