import mongoose, { Model } from "mongoose";

export interface IParticipant {
  name: string;
  age: number;
  weight: number;
  discipline: string;
  createdAT?: Date;
  updatedAt?: Date;
}

export type ParticipantModel = Model<IParticipant, Record<string, unknown>>;

export interface IFightCard {
  participants: mongoose.Types.ObjectId[];
  eventDate: Date;
  location: string;
  createdAT?: Date;
  updatedAt?: Date;
}
export type FightCardModel = Model<IFightCard, Record<string, unknown>>;
