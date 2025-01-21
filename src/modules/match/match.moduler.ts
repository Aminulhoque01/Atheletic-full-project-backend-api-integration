import mongoose, { model, Schema } from "mongoose";
import { IMatch } from "./match.interface";


// const MatchSchema = new Schema<IMatch>({
//     event: { type: Schema.Types.ObjectId, ref: "Event"},
//     winnerScores: { type: Number },
//     fighters: [
//         { type: Schema.Types.ObjectId, ref: "User", required: true }, // Two fighters
//     ],
//     summary: {
//         fighter1: {
//             fighter1: { type: Schema.Types.ObjectId, ref: "User", required: true },
//             movements: {
//                 type: Number,
//                 required: true,
//             },
//             others: {
//                 type: Number,
//                 required: true,
//             },
//             totalScore: { type: Number }
//         },
//         fighter2: {
//             fighter2: { type: Schema.Types.ObjectId, ref: "User", required: true },
//             movements: {
//                 type: Number,
//                 required: true,
//             },
//             others: {
//                 type: Number,
//                 required: true,
//             },
//             totalScore: { type: Number }
//         },
//     },
//     // Loser reference
//     draw: { type: Boolean, default: false },

//     winner: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     loser: { type: Schema.Types.ObjectId, ref: "User" },

// });



// export const Match = mongoose.model<IMatch>("Match", MatchSchema);



const MatchSchema = new Schema<IMatch>({
    fighters: {
        winnerScores: { type: Number },
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

        winner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        loser: { type: Schema.Types.ObjectId, ref: "User" }
    },
    judges: [
        {
            judgeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
            observations: { type: String },
            provisionalScore: { type: Number },
        },
    ],
    scoringJudge: { type: Schema.Types.ObjectId, ref: "User", required: true },
    finalScore: {
        fighter1Score: { type: Number, default: 0 },
        fighter2Score: { type: Number, default: 0 },
    },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
});

export const Match = model<IMatch>("Match", MatchSchema);