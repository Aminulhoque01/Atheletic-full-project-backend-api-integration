import { Types } from "mongoose";

export type IJudgmentProfile = {
    name: string;
    location: string;
    about: string;
    judgmentExperience: number;
    gender: string;
    dateOfBirth: Date;
    judgmentCategory: string;
    experienceAwardDetails: string;
}


export interface IFightCard {
     fightCards?: { _id: any; status: string, value: number}[];
    _id?: Types.ObjectId;
    participant1: string;
    participant2: string;
    status: string; 
    score: number;// e.g., "Scheduled", "Completed", "Draw"
    scores?: {
      participant1Score: number;
      participant2Score: number;
    };
}
  