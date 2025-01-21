import { model, Schema } from "mongoose";
import { EventModel, IEvent } from "./event.interface";


const EventSchema = new Schema<IEvent, EventModel>(
  {
    // eventID: { type: String, unique: true },
    manager: { type: Schema.Types.ObjectId, ref: "User" },
    eventName: { type: String, required: true },
    eventCategories: {  type: [],  ref:"Category", required: true },
    title: { type: String, required: true },
    eligibilityCriteria: {
      age: { type: Number},
      // weightCategory: { type: String, required: true },
      // discipline: { type: String, required: true },
    },
    isPaid: { type: Boolean, required: true },
    
    statistics: {
      registrations: { type: Number, default: 0 },
      paymentStatus: {
        paid: { type: Number, default: 0 },
        unpaid: { type: Number, default: 0 },
      },
    },
    tier: {
      type: String,
      enum: ["basic", "advanced"],
      // required: true,
    },
    eventType: {
      type: String,
      enum: ["GALA", "Tournament"],
      required: true
    },
    eventLocation: { type: String, required: true },
    registrationOpenDateTime: {
      RegistrationOpenDate: { type: Date, required: true },
      RegistrationOpenTime: { type: String, required: true },
      RegistonLastDate: { type: Date, required: true },
      RegistionLastTime: { type: String, required: true },
    },
    pre_registrationOpenDateTime: {
      Pre_RegistrationOpenDate: { type: Date, required: true },
      Pre_RegistrationOpenTime: { type: String, required: true },
      Pre_RegistonLastDate: { type: Date, required: true },
      Pre_RegistionLastTime: { type: String, required: true },
    },
    finalEventDateTime: {
      eventOpenDateline: { type: Date, required: true },
      eventOpenTime: { type: String, required: true },
      eventEndDateline: { type: Date, required: true },
      eventEndTime: { type: String, required: true },
    },
    
    chosenSports: { type: [String], required: true },
    eventEntryFee: { type: Number, required: true },
    eventDescription: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    id: { type: Schema.Types.ObjectId },
    eventLogo: { type: String, required: true, default: "/logo/logo.png" },
    eventBanner: {
      type: String,
      required: true,
      default: "/banner/banner.png",
    },

    invaitedjudges: [
      {
        judgeId: { type: Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
        invitedAt: { type: Date, default: Date.now },
      },
    ],
    // scores: { type: [Object], default: [] },
   
  },
  
  { timestamps: true },
 
);

EventSchema.pre("save", function (next) {
  if (!this.eventID) {
    this.eventID = this._id.toString();
  }
  next();
});



export const Event = model<IEvent, EventModel>("Event", EventSchema);


// // Add Methods
// EventSchema.methods.registerAthlete = function (athlete: string): void {
//   if (!this.participants.includes(athlete)) {
//     this.participants.push(athlete);
//   }
// };

// EventSchema.methods.viewEventDetails = function (): string {
//   return `Event: ${this.eventName}, Date: ${this.eventDate.toISOString()}, Location: ${this.eventLocation}`;
// };

// EventSchema.methods.updateEventDetails = function (details: Partial<IEvent>): void {
//   Object.assign(this, details);
// };

// export const Event = mongoose.model<IEvent>('Event', EventSchema);
