import { object } from "zod";
import jwt from "jsonwebtoken";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { EventFilterableFields } from "./event.constant";
import { IEvent, IFightCard, IFightResults } from "./event.interface";
import { EventService } from "./event.services";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import pick from "../../shared/pick";
import { paginationFields } from "../../shared/constrant";
import mongoose, { Error, Types } from "mongoose";

import sendError from "../../utils/sendError";
import { JWT_SECRET_KEY } from "../../config";
import { Event } from "./event.models";
import { UserModel } from "../user/user.model";

export const createEvent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...otherEventData } = req.body;

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
    console.log(managerId);

    if (!managerId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const managerid = await Event.findByIdAndUpdate(
      managerId,
      { $set: { managerId } },
      { new: true } // Return the updated document
    ).populate("managerId");

    const result = (await EventService.createEvent(
      otherEventData
    )) as unknown as IEvent & { _id: string };

    if (!result) {
      throw new Error("Failed to create event"); // Ensure null is handled explicitly
    }

    // Transform the result to include eventId explicitly
    const transformedResult = {
      ...result.toObject(),
      eventId: result._id.toString(),
    };
    // console.log(transformedResult)
    sendResponse<IEvent>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event created successfully!",
      data: transformedResult,
    });
  }
);

const getAllEvent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, EventFilterableFields);

    const paginationOptions = {
      page: parseInt(req.query.page as string, 10) || 1,
      limit: parseInt(req.query.limit as string, 10) || 10,
      ...pick(req.query, paginationFields),
    };

    const result = await EventService.getAllEvent(filters, paginationOptions);

    sendResponse<IEvent[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get all events successfully!",
      data: result?.data || [],
    });
  }
);

const getSingleEvent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await EventService.getSingleEvent(id);

    if (!result) {
      return sendResponse<IEvent | null>(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Event not found",
        data: null, // Explicitly return null
      });
    }

    sendResponse<IEvent>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event retrieved successfully!",
      data: result,
    });
  }
);

const updateEvent: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const updateData = req.body;

    const result = await EventService.eventUpdate(id, updateData);

    if (!result) {
      return sendResponse<IEvent | null>(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Event not found or update failed",
        data: null,
      });
    }

    sendResponse<IEvent>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event updated successfully",
      data: result,
    });

    next();
  }
);

const deleteEvent: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await EventService.eventDelete(id);

    if (!result) {
      return sendResponse<IEvent | null>(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Event not found or delete failed",
        data: null,
      });
    }

    sendResponse<IEvent>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event deleted successfully",
      data: result,
    });

    next();
  }
);

const generateFighterCard = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await EventService.generateFighter(id);

  if (!result) {
    throw new Error("Fighter card generation failed");
  }

  sendResponse<IEvent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event fighter card generated successfully",
    data: result,
  });
});





const eventResult: RequestHandler = catchAsync(async (req, res, next) => {
  const { id  } = req.params;
  console.log(id )
  // Validate eventId
  if (!id  || !mongoose.Types.ObjectId.isValid(id )) {
    throw new Error("Invalid Event ID: Must be a 24-character hex string.");
  }

  console.log("Validated eventId:", id );

  const results = await EventService.getFightResults(id);
  if (!results) {
    throw new Error("Fighter card generation failed.");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get event result successfully.",
    data: results,
  });
});


export const EventController = {
  createEvent,
  getAllEvent,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  generateFighterCard,

  eventResult
  
};
