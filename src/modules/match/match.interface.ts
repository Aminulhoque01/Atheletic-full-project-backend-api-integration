// export interface IFighter extends Document {
//     _id: string;
//     name: string;
//     score: number;
//     movements: number;
//     others: number;
// }

import mongoose from "mongoose";


export interface IMatch extends Document {
    event:mongoose.Types.ObjectId,
    fighter1:mongoose.Types.ObjectId;
    fighter2: mongoose.Types.ObjectId;
    winnerScores:number;
    draw:boolean;
    fighters:mongoose.Types.ObjectId
    summary: {
        movements: { fighter1: number; fighter2: number };
        others: { fighter1: number; fighter2: number };
    };
    winner: mongoose.Types.ObjectId;
    loser:mongoose.Types.ObjectId;
}