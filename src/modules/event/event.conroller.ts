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

import { body, validationResult } from 'express-validator';
import { clearGlobalAppDefaultCred } from "firebase-admin/lib/app/credential-factory";
import { CategoryModel } from "../category/category.model";

const validateEventData = [
  body('title').notEmpty().withMessage('Title is required'),
  body('eventName').notEmpty().withMessage('Event Name is required'),
  body('eventDescription').notEmpty().withMessage('Event Description is required'),
  body('eventEntryFee').isNumeric().withMessage('Event Entry Fee must be a number'),
  // Add more validations for nested fields as needed
];








const createEvent = catchAsync(async (req: Request, res: Response) => {


  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, httpStatus.UNAUTHORIZED, {
      message: "No token provided or invalid format.",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };
  const userId = decoded.id;

  if (!userId) {
    throw new Error("User ID or manager ID is required.");
  }

  const eventData = req.body;

  // Parse nested JSON fields if using form-data
  if (typeof eventData.fightCards === "string") {
    try {
      eventData.fightCards = JSON.parse(eventData.fightCards);
    } catch (error) {
      throw new Error("Invalid JSON format for fightCards.");
    }
  }
  if (typeof eventData.pre_registrationOpenDateTime === "string") {
    try {
      eventData.pre_registrationOpenDateTime = JSON.parse(eventData.pre_registrationOpenDateTime);
    } catch (error) {
      throw new Error("Invalid JSON format for pre_registrationOpenDateTime.");
    }
  }
  if (typeof eventData.registrationOpenDateTime === "string") {
    try {
      eventData.registrationOpenDateTime = JSON.parse(eventData.registrationOpenDateTime);
    } catch (error) {
      throw new Error("Invalid JSON format for registrationOpenDateTime.");
    }
  }
  if (typeof eventData.finalEventDateTime === "string") {
    try {
      eventData.finalEventDateTime = JSON.parse(eventData.finalEventDateTime);
    } catch (error) {
      throw new Error("Invalid JSON format for finalEventDateTime.");
    }
  }

  // Parse stringified fields
  if (typeof eventData.eventCategories === "string") {
    try {
      eventData.eventCategories = JSON.parse(eventData.eventCategories);
    } catch (error) {
      throw new Error("Invalid JSON format for eventCategories.");
    }
  }
  if (typeof eventData.chosenSports === "string") {
    try {
      eventData.chosenSports = JSON.parse(eventData.chosenSports);
    } catch (error) {
      throw new Error("Invalid JSON format for eventCategories.");
    }
  }
  if (typeof eventData.eventDescription === "string") {
    // Clean up the string
    eventData.eventDescription = eventData.eventDescription.trim().replace(/^"(.*)"$/, '$1');
  }


  console.log(eventData.eventDescription);


  eventData.isPaid = typeof eventData.isPaid === "boolean" ? eventData.isPaid : false;




  const existingEvent = await Event.findOne({ eventName: eventData.eventName });
  if (existingEvent) {
    return sendError(res, httpStatus.CONFLICT, {
      message: "An event with the same name already exists.",
    });
  }



  // Add the manager ID
  eventData.manager = userId;

  let eventCategories = eventData.eventCategories

  //.................>
  if (typeof eventCategories === "string") {
    try {
      eventCategories = JSON.parse(eventCategories);
    } catch (error) {
      return sendError(res, httpStatus.BAD_REQUEST, { message: "Invalid JSON format for eventCategories." });
    }
  }
  // Ensure eventCategories is an array or a single ObjectId
  if (!Array.isArray(eventCategories)) {
    eventCategories = [eventCategories];
  }

  // Validate each category ID
  const invalidCategories = eventCategories.filter((category: any) => !mongoose.Types.ObjectId.isValid(category));
  if (invalidCategories.length > 0) {
    return sendError(res, httpStatus.BAD_REQUEST, { message: "One or more eventCategories are invalid ObjectIds." });
  }



  //..........

  // Save the event
  const event = await EventService.createEvent({ ...eventData, eventCategories });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Event created successfully!",
    data: event,
  });
});








const getMyEvent = catchAsync(async (req: Request, res: Response) => {
  const userRole = req.user.role;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, httpStatus.UNAUTHORIZED, {
      message: "No token provided or invalid format.",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };
  const userId = decoded.id;

  console.log("Decoded User ID:", userId);

  let events;

  if (userRole === "eventManager") {
    events = await EventService.getEventsByManager(userId);
  }


  console.log("Fetched Events:", events);

  sendResponse<IEvent[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get my events successfully!",
    data: events || [],
  });
});










const getAllEvent = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, EventFilterableFields);

    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string, 10) || 10);
    const paginationOptions = {
      page,
      limit,
      ...pick(req.query, paginationFields),
    };

    console.log("Filters: ", filters);
    console.log("Pagination Options: ", paginationOptions);

    const result = await EventService.getAllEvent(filters, paginationOptions);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get all events successfully!",
      // meta: result.meta,
      data: result.data,
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

const newrecentEvent = catchAsync(async (req: Request, res: Response) => {
  const result = await EventService.getRecentEvent();
  // console.log(`sadsadsaf`,result)  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fetched all recent events successfully.",
    data: result, // Return all sorted events
  });
});




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







const myEventResult: RequestHandler = catchAsync(async (req, res, next) => {
  const eventId = req.params.id;
  console.log(`asdfsdsdfsdfsdfsfsdf`, eventId)

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return sendError(res, httpStatus.BAD_REQUEST, {
      message: "Invalid event ID format.",
    });
  }
  // Extract token from authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, httpStatus.UNAUTHORIZED, {
      message: "No token provided or invalid format.",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };
  const fighterId = decoded.id;

  // Call service to get event results
  const result = await EventService.getMyEventResults(fighterId, eventId);



  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get event result successfully.",
    data: result,
  });
});


const getWonEvents: RequestHandler = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, httpStatus.UNAUTHORIZED, {
      message: "No token provided or invalid format.",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };
  const fighterId = decoded.id;

  console.log(`asdasdasdasd`, fighterId);

  // Fetch events the fighter won
  const wonEvents = await EventService.getFighterWonEvents(fighterId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Fighter's won events retrieved successfully.",
    data: wonEvents,
  });
});


const myEventHistory = catchAsync(async(req:Request, res:Response)=>{

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, httpStatus.UNAUTHORIZED, {
      message: "No token provided or invalid format.",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };
  const managerId = decoded.id;

  const events = await EventService.getEventHistoryByManager(managerId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get my events history successfully.",
    data: events,
  });

})



export const EventController = {
  createEvent,
  getAllEvent,
  getSingleEvent,

  updateEvent,
  deleteEvent,
  myEventHistory,

  myEventResult,
  getWonEvents,
  getMyEvent,
  newrecentEvent,

  // getEventRestion

};
