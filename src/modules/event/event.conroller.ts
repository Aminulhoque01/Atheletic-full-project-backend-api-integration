import { NextFunction, Request, RequestHandler, Response } from "express";
import { EventFilterableFields } from "./event.constant";
import { IEvent } from "./event.interface";
import { EventService } from "./event.services";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import pick from "../../shared/pick";
import { paginationFields } from "../../shared/constrant";
import { Error } from "mongoose";
import { CategoryService } from "../category/category.service";
import { ICategory } from "../category/category.interface";

export const createEvent: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const { ...userData } = req.body;

    const result = await EventService.createEvent(userData);

    if (!result) {
      throw new Error("Failed to create event"); // Ensure null is handled explicitly
    }

    sendResponse<IEvent>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Event created successfully!",
      data: result,
    });
  }
);

const getAllEvent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, EventFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

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


export const EventController = {
  createEvent,
  getAllEvent,
  getSingleEvent,
  updateEvent,
  deleteEvent,
  generateFighterCard
  
};
