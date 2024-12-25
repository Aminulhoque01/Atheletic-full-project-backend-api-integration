import { CategoryModel } from "./category.model";
 
import { ICategory } from "./category.interface";

const createCategory = async (category:ICategory):Promise<ICategory> => {
    const result = await CategoryModel.create(category);
    return result
};


const updateCategory = async ( userId: string, categoryData: ICategory): Promise<ICategory | null> => {
    try {
      // Use findByIdAndUpdate to update and return the updated document
     
      return await CategoryModel.findOneAndUpdate(
        { _id: userId, userId}, // Match both category and user
        { $set: categoryData },
        { new: true }
      );
  
       // Return the updated category
    } catch (error) {
      console.error("Error updating category:", error);
      throw new Error("Failed to update category"); // Throw an error for caller to handle
    }
  };
  



const getInterest = async () => {
  const interests = await CategoryModel.find(); // Fetch all interest data
  return interests;
};


const deleteCategory = async(id:string) => {
  const result = await CategoryModel.findByIdAndDelete(id); 
  return result;
}

const categoryId= async(id:string) => {
  const result = await CategoryModel.findById(id); 
  return result;
}

export const CategoryService = {
  createCategory,
  getInterest,
  deleteCategory,
  updateCategory,
  categoryId
    
}