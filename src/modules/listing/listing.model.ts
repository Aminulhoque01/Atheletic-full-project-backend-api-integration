import mongoose, { Schema } from "mongoose";
import { IListing } from "./listing.interface";

const listingSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    sport: { type: String, required: true },
    weightClass: { type: String },
    trainingType: { type: String },
    location: {
      city: { type: String, required: true },
      radius: { type: Number, default: 10 },
    },
    userId: { type: String, required: true },
    isProUser: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ListingModel = mongoose.model<IListing>("Listing", listingSchema);
