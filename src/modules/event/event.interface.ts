import { Model } from "mongoose";

export interface IEvent {
  _id: string;
  eventID: string;
  managerId: object;
  title: string;
  eligibilityCriteria: {
    age: number;
    weightCategory: string;
    discipline: string;
  };
  isPaid: boolean;
  fightCards: {
    participant1: string;
    participant2: string;
    status: string;
  }[];
  statistics: {
    registrations: number;
    paymentStatus: {
      paid: number;
      unpaid: number;
    };
  };
  eventName: string; // Event title name
  eventTitleName:string;
  eventCategories: string[]; // Event categories
  eventType: string; // Event type
  eventLocation: string; // Event location
  registrationOpenDateTime: Date; // Registration open date & time
  registrationLastDateTime: Date; // Registration last date & time
  preRegistrationOpenDateTime?: Date; // Optional pre-registration open date & time
  preRegistrationLastDateTime?: Date; // Optional pre-registration last date & time
  finalEventDateTime: Date; // Final event dateline
  eventEndDateTime: Date; // Event end date & time
  chosenSports: string[]; // Chosen sports
  eventEntryFee: number; // Event entry fee
  eventDescription: string;
  
  participants: string[];
  tier: 'basic' | 'advanced';
  isRegistered?: boolean; // Event description
  createdAt?: Date; // Optional created date
  updatedAt?: Date; // Optional updated date
   // Event price
 
}

export type EventModel = Model<IEvent, Record<string, unknown>>;

export type IEventFilters = {
  searchTerm?: string;
  eventTitleName?: number;
  eventName?: string;
  eventDate?: Date;
  eventLocation?: string;
};
