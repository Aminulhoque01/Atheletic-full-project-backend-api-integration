import { adminMiddleware } from "../../middlewares/auth";
import { Router } from "express";
import upload from "../../middlewares/fileUploadNormal";
import { CategoryController } from "./category.controller";

const router = Router();

router.post(
  "/create",
  adminMiddleware("admin"), // Only "admin" role can access
  upload.single("image"),
  CategoryController.createCategory
);

router.patch(
  "/update/:id",
  adminMiddleware(["admin", "eventManager", "fighter"]), // Multiple roles can access
  upload.single("image"),
  CategoryController.updateCategory
);

router.get("/", CategoryController.getInterest);

router.delete(
  "/:id",
  adminMiddleware("admin"), // Only "admin" role can access
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;

                         