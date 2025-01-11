import mongoose, { Schema } from "mongoose";
import { IJudgmentProfile } from "./judgment.interface";
import { IFightCard } from "../event/event.interface";



const FightCardSchema = new Schema<IFightCard>({
  // existing schema properties

  fightCards: [
    {
      _id: { type: Schema.Types.ObjectId, required: true },

      status: { type: String, required: true },
      score: { type: Number, required: true },
    },
  ],
});

export const FightCardModel = mongoose.model<IFightCard>(
  "fighterCard",
  FightCardSchema
);
