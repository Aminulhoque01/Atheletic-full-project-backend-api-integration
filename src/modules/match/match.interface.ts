// export interface IFighter extends Document {
//     _id: string;
//     name: string;
//     score: number;
//     movements: number;
//     others: number;
// }

import mongoose, { Types } from "mongoose";


// export interface IMatch extends Document {
//     event:mongoose.Types.ObjectId,
//     fighter1:mongoose.Types.ObjectId;
//     fighter2: mongoose.Types.ObjectId;
//     winnerScores:number;
//     draw:boolean;
//     fighters:mongoose.Types.ObjectId
//     summary: {
//         movements: { fighter1: number; fighter2: number };
//         others: { fighter1: number; fighter2: number };
//     };
//     winner: mongoose.Types.ObjectId;
//     loser:mongoose.Types.ObjectId;
// }

export interface IMatch {
    fighters: { fighter1: Types.ObjectId; fighter2: Types.ObjectId };
    judges: [
      {
        judgeId: Types.ObjectId; // Reference to User
        observations?: string; // Optional field for observations
        provisionalScore?: number; // Optional provisional score
      }
    ];
    scoringJudge: Types.ObjectId; // Reference to User who will submit the final score
    finalScore: {
      fighter1Score: number;
      fighter2Score: number;
    };
    status: "pending" | "completed"; // Match status
    eventId: Types.ObjectId; // Reference to Event
  }