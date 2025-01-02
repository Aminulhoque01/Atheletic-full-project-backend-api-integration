import { model, Schema } from "mongoose";
import { FighterModel, IFighter } from "./fighter.interface";

const FighterSchema = new Schema<IFighter, FighterModel>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  discipline: {
    type: String,
    required: true,
  },
  age: { 
    type: Number,
     required: true 
    },
  weight: { 
    type: Number, 
    required: true 
  },
  weightCategory: {
    type: String,
    required: true,
  },
  ageCategory: {
    type: String,
    required: true,
  },
  events: {
    type: [String],
    default: [],
  },
  
  isRegistered:{ type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Fighter = model<IFighter, FighterModel>("Fighter", FighterSchema);
