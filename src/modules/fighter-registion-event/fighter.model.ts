import mongoose, { model, Schema } from "mongoose";
import { IWallet } from "./fighter.interface";

const TournamentSchema = new mongoose.Schema({
  eventID: { type: String, required: true },
  fightCards: [
    {
      participant1: { type: Schema.Types.ObjectId, ref: "User", required: true },
      participant2: { type: Schema.Types.ObjectId, ref: "User", required: true },
      status: { type: String, default: "Scheduled" },
      score: { type: Number, default: 0 },
      fightDate: { type: Date, required: true }, // Fight date and time
      duration: { type: Number, default: 60 }, // Duration in minutes
    },
  ],
  createdAt: { type: Date, default: Date.now },
});


 
export const TournamentModel = mongoose.model('Tournament', TournamentSchema);



