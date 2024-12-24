import { adminMiddleware } from './../../middlewares/auth';
import { Router } from "express";

// import { adminMiddleware } from "../../middlewares/auth";
import upload from "../../middlewares/fileUploadNormal";
import { CategoryController } from "./category.controller";

const router =Router();

router.post("/create", adminMiddleware("admin"), upload.single("image"), CategoryController.createCategory);
router.patch("/update/:id"  ,adminMiddleware("admin"), upload.single("image"), CategoryController.updateCategory);
router.get("/", CategoryController.getInterest)
router.delete("/:id", adminMiddleware("admin"), CategoryController.deleteCategory)




 export const CategoryRoutes = router;

                         