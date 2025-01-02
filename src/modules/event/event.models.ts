import { model, Schema } from "mongoose";
import { EventModel, IEvent } from "./event.interface";
import uuidv4 from "uuid";

const EventSchema = new Schema<IEvent, EventModel>(
  {
    eventID: { type: String, unique: true },
    managerId: { type: Schema.Types.ObjectId, ref: "EventManager",  },
    eventName: { type: String, required: true  },
    eventCategories: { type: [String], required: true },
    title: { type: String, required: true },
    eligibilityCriteria: {
      age: { type: Number, required: true },
      weightCategory: { type: String, required: true },
      discipline: { type: String, required: true },
    },
    isPaid: { type: Boolean, required: true },
    fightCards: [
      {
        participant1: { type: String, required: true },
        participant2: { type: String, required: true },
        status: { type: String, default: "Scheduled" },
      },
    ],
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
    eventType: { type: String, required: true },
    eventLocation: { type: String, required: true },
    registrationOpenDateTime: { type: Date, required: true },
    registrationLastDateTime: { type: Date, required: true },
    preRegistrationOpenDateTime: { type: Date, default: null },
    preRegistrationLastDateTime: { type: Date, default: null },
    finalEventDateTime: { type: Date, required: true },
    eventEndDateTime: { type: Date, required: true },
    chosenSports: { type: [String], required: true },
    eventEntryFee: { type: Number, required: true },
    eventDescription: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
     
    
  },
  { timestamps: true }
);

EventSchema.pre("save", function (next) {
  if (!this.eventID) {
    // Generate a custom eventID (e.g., based on timestamp + unique ID)
    this.eventID = `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
