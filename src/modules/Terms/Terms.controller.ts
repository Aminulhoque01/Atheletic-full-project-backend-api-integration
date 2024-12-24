import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import sendError from "../../utils/sendError";
import {
  createTermsInDB,
  getAllTermsFromDB,
  updateTermsInDB,
} from "./Terms.service";
import sendResponse from "../../utils/sendResponse";
import { findUserById } from "../user/user.service";
import catchAsync from "../../utils/catchAsync";

import sanitizeHtml from "sanitize-html";
import { JWT_SECRET_KEY } from "../../config";
import { Request, Response } from "express";
import { ITerms } from "./Terms.interface";

const sanitizeOptions = {
  allowedTags: [
    "b",
    "i",
    "em",
    "strong",
    "a",
    "p",
    "br",
    "ul",
    "ol",
    "li",
    "blockquote",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "code",
    "pre",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "target"],
    img: ["src", "alt"],
  },
  allowedIframeHostnames: ["www.youtube.com"],
};

export const createTerms = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, httpStatus.UNAUTHORIZED, {
      message: "No token provided or invalid format.",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };
  const userId = decoded.id; // Assuming the token contains the userId

  // Find the user by userId
  const user = await findUserById(userId);
  if (!user) {
    return sendError(res, httpStatus.NOT_FOUND, {
      message: "User not found.",
    });
  }

  // Check if the user is an admin
  if (user.role !== "admin") {
    return sendError(res, httpStatus.FORBIDDEN, {
      message: "Only admins can create terms.",
    });
  }

  const { description } = req.body;
  const sanitizedContent = sanitizeHtml(description, sanitizeOptions);
  if (!description) {
    return sendError(res, httpStatus.BAD_REQUEST, {
      message: "Description is required!",
    });
  }

  const result = await createTermsInDB({ sanitizedContent });

  sendResponse<ITerms>(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Terms created successfully.",
    data: result,
  });
});

export const getAllTerms = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllTermsFromDB();
  // const responseData = result[0] || {}
  sendResponse<ITerms>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms retrieved successfully.",
    data:result[0],
  });
});

export const updateTerms = catchAsync(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, httpStatus.UNAUTHORIZED, {
      message: "No token provided or invalid format.",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };

  const userId = decoded.id;

  // Find the user by userId
  const user = await findUserById(userId);
  if (!user) {
    return sendError(res, httpStatus.NOT_FOUND, {
      message: "User not found.",
    });
  }

  // Check if the user is an admin
  if (user.role !== "admin") {
    return sendError(res, httpStatus.FORBIDDEN, {
      message: "Only admins can update terms.",
    });
  }

  // Sanitize the description field
  const { description } = req.body;

  if (!description) {
    return sendError(res, httpStatus.BAD_REQUEST, {
      message: "Description is required.",
    });
  }

  const sanitizedDescription = sanitizeHtml(description, sanitizeOptions);

  // Assume you're updating the terms based on the sanitized description
  const result = await updateTermsInDB(sanitizedDescription);

  if (!result) {
    return sendError(res, httpStatus.INTERNAL_SERVER_ERROR, {
      message: "Failed to update terms.",
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Terms updated successfully.",
    data: result,
  });
});
