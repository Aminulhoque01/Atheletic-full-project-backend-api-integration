import mongoose, { Schema } from "mongoose";
import { ICategory } from "./category.interface";




const CategorySchema= new Schema<ICategory>({
 
    image: {
        type: {
          publicFileURL: { type: String, trim: true },
          path: { type: String, trim: true },
        },
        required: false,
        default: {
          publicFileURL: "/images/user.png",
          path: "public\\images\\user.png",
        },
      },
      categoryName: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
   
}, { timestamps: true });




export const CategoryModel = mongoose.model<ICategory>("Category", CategorySchema);
