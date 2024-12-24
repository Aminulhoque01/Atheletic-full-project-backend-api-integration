import { Request, Response, NextFunction } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { IListing } from "./listing.interface";
import httpStatus from "http-status";
import { ListingService } from "./listing.service";
import { ListingModel } from "./listing.model";

const createListing = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { title, description, sport, location, userId, isProUser } = req.body;
    const result = await ListingService.listingCreate({
      title,
      description,
      sport,
      location,
      userId,
      isProUser: isProUser || false,
      
    });
    // const savedListing = await result.save();
    if (!result) {
      throw new Error("Failed to create athletic");
    }

    sendResponse<IListing>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "List created successfully.",
      data: result,
    });
    next();
  }
);

const getAllListings= catchAsync(async (req: Request, res: Response) => {
 
  const AllListings = await ListingModel.find();

  sendResponse<IListing[]>(res,{
    success: true,
    statusCode: httpStatus.OK,
    message: " all-user get successfully.",
    data: AllListings,
  })
})

// 2. Browse Listings (Search with Filters)
const getListingUser = catchAsync(async(req: Request, res: Response)=>{
  const { sport, weightClass, trainingType, location, isProUser } = req.query;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any = {};

  if (sport) filters.sport = sport;
  if (weightClass) filters.weightClass = weightClass;
  if (trainingType) filters.trainingType = trainingType;
  if (location) filters["location.city"] = location;
  if (isProUser === "true") filters.isProUser = true;

  const listings = await ListingModel.find(filters).sort({ createdAt: -1 }).lean();
  
  sendResponse<IListing[]>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "List all-user successfully.",
    data: listings,
  });
})


const getProUsers= catchAsync(async (req: Request, res: Response) => {
  const proUsers = await ListingModel.find({ isProUser: true });
 

  sendResponse<IListing[]>(res,{
    success: true,
    statusCode: httpStatus.OK,
    message: " get proUsers successfully.",
    data: proUsers,
  })

})


export const ListingController = {
  createListing,
  getAllListings,
  getListingUser,
  getProUsers
};
