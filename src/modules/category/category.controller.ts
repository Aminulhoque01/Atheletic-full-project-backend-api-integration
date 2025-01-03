import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { ICategory } from "./category.interface";
import { CategoryService } from "./category.service";
import multer from "multer";
import { getUserList } from "../user/user.service";
import { JWT_SECRET_KEY } from "../../config";
import { UserModel } from "../user/user.model";
import { error } from "winston";
import { CategoryModel } from "./category.model";
import sendError from "../../utils/sendError";
import { Event } from "../event/event.models";


const createCategory = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { ...categoryData } = req.body;

    

    const result = await CategoryService.createCategory(categoryData);
    

    sendResponse<ICategory>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category created successfully",
      data: result,
    });
  }
);





const updateCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  let { interests } = req.body;

  // console.log(`Request Body:`, req.body);
  // console.log(`Interests (Before Parsing):`, interests);

  // Parse interests if it is a string
  if (typeof interests === 'string') {
    try {
      interests = JSON.parse(interests);
    } catch (error) {
      return sendError(res, httpStatus.BAD_REQUEST, { message: "Invalid interests format." });
    }
  }

  console.log(`Interests (After Parsing):`, interests);

  req.body.interests = interests; // Update the parsed interests back to req.body

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
    return sendError(res, httpStatus.UNAUTHORIZED, { message: "User not authenticated." });
  }

  if (!interests || !Array.isArray(interests)) {
    return sendError(res, httpStatus.BAD_REQUEST, { message: "Invalid interests array provided." });
  }

  // Update user interests
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { interests } },
    { new: true }
  ).populate("interests");

  if (!updatedUser) {
    return sendError(res, httpStatus.INTERNAL_SERVER_ERROR, { message: "Failed to update interests." });
  }

  // Find events matching updated interests
  const matchingEvents = await Event.find({ category: { $in: interests } });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully.",
    data: { user: updatedUser, events: matchingEvents },
  });
});

const getInterest = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getInterest();

  sendResponse<ICategory[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "get all interest",
    data: Array.isArray(result) ? result : [],
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CategoryService.deleteCategory(id);
  if (!result) {
    throw new Error("Category not found");
  }
  sendResponse<ICategory>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  updateCategory,
  getInterest,
  deleteCategory,
};
