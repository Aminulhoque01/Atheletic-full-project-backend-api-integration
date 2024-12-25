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

// const createCategory = catchAsync(async (req: Request, res: Response) => {
//   const { image, category_name } = req.body;

//   const insertData: any = {};
//   if (category_name) insertData.category_name = category_name;

//   if (req.file) {
//     const imagePath = `public\\images\\${req.file.filename}`;
//     const publicFileURL = `/images/${req.file.filename}`;

//     insertData.image = {
//       path: imagePath,
//       publicFileURL: publicFileURL,
//     };
//   }

//   const result = await CategoryService.createCategory({ image, category_name });

//   if (result && category_name && insertData.image) {
//     const adminId = req.user.id; // Assuming you have the adminId in the request user object
//     const skip = 0; // Define skip
//     const limit = 10; // Define limit
//     const date = new Date().toISOString(); // Define date as ISO string
//     const name = ''; // Define name
//     const email = ''; // Define email
//     const users = await getUserList(adminId, skip, limit, date, name, email); // Assuming you have a method to fetch all users

//     for (const user of users.users) {
//       user.interests = user.interests || [];
//       user.interests.push(JSON.stringify({
//         category_name: category_name,
//         image: insertData.image.publicFileURL,
//       }));

//       await user.save(); // Save the updated user
//     }
//   }

//   sendResponse<ICategory>(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Category created successfully",
//     data: result,
//   });
// });

const createCategory = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { image, category_name } = req.body;

    // console.log("usr---------", req.user);

    const insertData: any = {};
    if (category_name) insertData.category_name = category_name;

    if (req.file) {
      const imagePath = `public\\images\\${req.file.filename}`;
      const publicFileURL = `/images/${req.file.filename}`;

      insertData.image = {
        path: imagePath,
        publicFileURL: publicFileURL,
      };
    }

    const result = await CategoryService.createCategory(insertData);
    console.log(result);

    sendResponse<ICategory>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category created successfully",
      data: result,
    });
  }
);

// const updateCategory = catchAsync(async (req: Request, res: Response) => {

//   const categoryId = req.params.id;
//   const userId = req.user.id;

//   console.log("Params:", userId);
//   console.log("Body:", categoryId);

//   const result = await UserModel.findByIdAndUpdate(
//     userId,
//     { $push: { interests: categoryId } },
//     { new: true } // Return the updated document
//   );

//   const user = await UserModel.findById(userId).populate('interests');

//   if (!result) {
//     throw new Error("Failed to update category!");
//   }

//   sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: "Category updated successfully",
//     data: result,
//   });
// });

// export const updateCategory = async (req: Request, res: Response):Promise<void> => {
//   try {
//     const { id } = req.params; // Extract `id` from route parameters
//     if (!id) {
//       return res.status(400).json({ message: "Category ID is required." });
//     }

//     // Log params and body for debugging
//     console.log("Params:", req.params);
//     console.log("Body:", req.body);

//     const updatedCategory = await CategoryService.updateCategory(id, req.body);

//     if (!updatedCategory) {
//       return res.status(404).json({ message: "Category not found." });
//     }

//     return res
//       .status(200)
//       .json({ message: "Category updated successfully.", updatedCategory });
//   } catch (error) {
//     console.error("Error updating category:", error);
//     return res.status(500).json({ message: "Internal server error.", error });
//   }
// };

const updateCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const categoryId = req.params?.id; // Use optional chaining
  const userId = req.user?.id; // Use optional chaining

  // Validate inputs
  if (!categoryId) {
    res.status(400).json({ error: "Category ID is required" });
    return;
  }
  if (!userId) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  console.log("Params:", req.params);
  console.log("User:", req.user);

  const result = await UserModel.findByIdAndUpdate(
    userId,
    { $push: { interests: categoryId } },
    { new: true } // Return the updated document
  );

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
