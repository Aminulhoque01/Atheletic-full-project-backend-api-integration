import { Model } from "mongoose";

export interface IFighter {
  name: string;
  email: string;
  discipline: string;
  age: number;
  weight: number;
  weightCategory: string;
  ageCategory: string;
  events: string[];
  isRegistered: boolean;
  participants: string[];
  createdAt?: Date; // Optional created date
  updatedAt?: Date; // Optional updated date
}
export type FighterModel = Model<IFighter, Record<string, unknown>>;