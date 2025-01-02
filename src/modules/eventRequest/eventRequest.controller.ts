import { createEvent } from "../event/event.conroller";

// import { IEventRequest } from "./eventRequest.interface";
// import { EventRequest } from "./eventRequest.model";

import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";

import sendResponse from "../../utils/sendResponse";
import { IEventRequest } from "./eventRequest.interface";
// import createEventRequestService from "./eventRequest.service"
import httpStatus from "http-status";
import { EventRequestService } from "./eventRequest.service";
import { EventRoutes } from "../event/event.route";

const createEventRequest = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { eventID, fighterID } = req.body;
    const result = await EventRequestService.createEventRequestService(
      eventID,
      fighterID
    );

    sendResponse<IEventRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event Request send successfully",
      data: result,
    });
  }
);

const getRequestsForEvent = catchAsync(
  async (req: Request, res: Response) => {
    const { eventID } = req.body;
    const requests = await EventRequestService.getRequestsForEvent(eventID);

    sendResponse<IEventRequest[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event Request get successfully",
      data: requests,
    });
  }
);
const getRequestsForFighter = catchAsync(
  async (req: Request, res: Response) => {
    const { fighterID } = req.body;
    const requests = await EventRequestService.getRequestsForFighter(fighterID);

    sendResponse<IEventRequest[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event Request get successfully",
      data: requests,
    });
  }
);

const getAllRequests = catchAsync(
  async (req: Request, res: Response) => {
   
    const requests = await EventRequestService.getAllRequests();

    sendResponse<IEventRequest[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: " All Event Request get  successfully",
      data: requests,
    });
  }
);

const updateRequestStatus = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { requestID } = req.body;
    const { status } = req.body;
    const updatedRequest = await EventRequestService.updateRequestStatus(
      requestID,
      status
    );

    if (!updatedRequest) {
      throw new Error("Request not found");
    }

    sendResponse<IEventRequest>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Request status updated successfully",
      data: updatedRequest,
    });
  }
);



export const EventRequestController = {
  createEventRequest,
  getRequestsForEvent,
  updateRequestStatus,
  getRequestsForFighter,
  getAllRequests
};
