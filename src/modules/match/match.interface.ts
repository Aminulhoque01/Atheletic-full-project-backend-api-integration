// export interface IFighter extends Document {
//     _id: string;
//     name: string;
//     score: number;
//     movements: number;
//     others: number;
// }

import mongoose from "mongoose";


export interface IMatch extends Document {
    fighter1:mongoose.Types.ObjectId;
    fighter2: mongoose.Types.ObjectId;
    scores:number;
    summary: {
        movements: { fighter1: number; fighter2: number };
        others: { fighter1: number; fighter2: number };
    };
    winner: mongoose.Types.ObjectId;
}