import mongoose, { Schema } from "mongoose";
import { IMatch } from "./match.interface";


const MatchSchema = new Schema<IMatch>({
    event: { type: Schema.Types.ObjectId, ref: "Event"},
    winnerScores: { type: Number },
    fighters: [
        { type: Schema.Types.ObjectId, ref: "User", required: true }, // Two fighters
    ],
    summary: {
        fighter1: {
            fighter1: { type: Schema.Types.ObjectId, ref: "User", required: true },
            movements: {
                type: Number,
                required: true,
            },
            others: {
                type: Number,
                required: true,
            },
            totalScore: { type: Number }
        },
        fighter2: {
            fighter2: { type: Schema.Types.ObjectId, ref: "User", required: true },
            movements: {
                type: Number,
                required: true,
            },
            others: {
                type: Number,
                required: true,
            },
            totalScore: { type: Number }
        },
    },
    // Loser reference
    draw: { type: Boolean, default: false },

    winner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    loser: { type: Schema.Types.ObjectId, ref: "User" },

});



export const Match = mongoose.model<IMatch>("Match", MatchSchema);