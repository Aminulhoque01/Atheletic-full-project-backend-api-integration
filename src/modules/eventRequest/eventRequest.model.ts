import { Schema } from "mongoose";
import { EventRequestModel, IEventRequest } from "./eventRequest.interface";
import { model } from "mongoose";

const EventRequestSchema = new Schema<IEventRequest>(
  {
    fighterID: { type: String, required: true },
    eventID: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const EventRequest = model<IEventRequest, EventRequestModel>(
  "EventRequest",
  EventRequestSchema
);
