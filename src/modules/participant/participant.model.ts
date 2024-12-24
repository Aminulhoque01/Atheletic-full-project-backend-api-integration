import { model, Schema } from "mongoose";
import { FightCardModel, IFightCard, IParticipant, ParticipantModel } from "./participant.interface";

const ParticipantSchema = new Schema<IParticipant, ParticipantModel>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  discipline: { type: String, required: true },
});

export const Participant = model<IParticipant>(
  "Participant",
  ParticipantSchema
);

const FightCardSchema= new Schema<IFightCard, FightCardModel>({
  participants: [{ type: Schema.Types.ObjectId, ref: "Participant" }],
  eventDate: { type: Date, required: true },
});

export const FighterCard= model("IFighterCard", FightCardSchema);
