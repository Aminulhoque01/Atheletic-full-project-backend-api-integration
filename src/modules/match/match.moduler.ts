import mongoose, { Schema } from "mongoose";
import { IMatch } from "./match.interface";

const MatchSchema = new Schema<IMatch>({
    fighter1: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fighter2: { type: Schema.Types.ObjectId, ref: "User", required: true },
    summary: {
        movements: {
            fighter1: { type: Number, required: true },
            fighter2: { type: Number, required: true },
        },
        others: {
            fighter1: { type: Number, required: true },
            fighter2: { type: Number, required: true },
        },
    },
    winner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export const Match = mongoose.model<IMatch>("Match", MatchSchema);