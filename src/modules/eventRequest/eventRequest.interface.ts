import { Model } from "mongoose";

export type IEventRequest = {
  fighterID: string;
  eventID: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}


export interface EventRequestModel extends Model<IEventRequest> {}