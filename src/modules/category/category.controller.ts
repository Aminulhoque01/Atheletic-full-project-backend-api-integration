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
  const { interests } = req.body;
  
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
  const userId = decoded.id;


  if (!userId) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }



  if (!interests || !Array.isArray(interests)) {
    return sendError(res, httpStatus.BAD_REQUEST, {
      message: "Invalid interests array provided.",
    });
  }

  const result = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { interests } },
    { new: true } // Return the updated document
  )

  if (!result) {
    throw new Error("Failed to update category!");
  }

  const user = await UserModel.findById(userId).populate("interests");

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully",
    data: user, // Include populated user data
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
