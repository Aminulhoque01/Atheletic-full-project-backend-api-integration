import { Model, Schema, Types } from "mongoose";


interface IFightCards {
  _id: any;
  fighterID: any;
  participant1: string;
  participant2: string;
  status?: string;
  score?: number;
}

interface IPaymentStatus {
  paid: number;
  unpaid: number;
};

interface IStatistics {
  registrations: number;
  paymentStatus: IPaymentStatus;
};

interface IDateTimeRange {
  RegistrationOpenDate: Date;
  RegistrationOpenTime: string;
  RegistonLastDate: Date;
  RegistionLastTime: string;
};

interface IPreDateTimeRange {
  Pre_RegistrationOpenDate: Date;
  Pre_RegistrationOpenTime: string;
  Pre_RegistonLastDate: Date;
  Pre_RegistionLastTime: string;
};

interface IFinalEventDateTime {
  eventOpenDateline: Date;
  eventOpenTime: string;
  eventEndDateline: Date;
  eventEndTime: string;
}


export interface IEvent {
  id: Schema.Types.ObjectId;
  eventBanner:string,
  eventLogo:string,
  eventID: string;
  manager: object;
  title: string;
  eligibilityCriteria: {
    age: number;
    weightCategory: string;
    discipline: string;
  };
  isPaid: boolean;
  fightCards:IFightCards[];
  statistics: IStatistics;
  eventName: string; // Event title name
  eventTitleName:string;
  eventCategories: Schema.Types.ObjectId; // Event categories
  eventType: 'gala' | 'tournament'; // Event type
  
  eventLocation: string; // Event location
  registrationOpenDateTime: IDateTimeRange; // Registration open date & time
  
  pre_registrationOpenDateTime?: IPreDateTimeRange; // Optional pre-registration open date & time
 
   
  finalEventDateTime:IFinalEventDateTime;
    
  chosenSports: string[]; // Chosen sports
  eventEntryFee: number; // Event entry fee
  eventDescription: string;
  
  participants: string[];
  tier: 'basic' | 'advanced';
  isRegistered?: boolean; // Event description
  createdAt?: Date; // Optional created date
  updatedAt?: Date; // Optional updated date
   // Event price
   scores?: number[];

   invaitedjudges:IJudge[]
}

export type EventModel = Model<IEvent, Record<string, unknown>>;

export type IEventFilters = {
  searchTerm?: string;
  eventTitleName?: number;
  eventName?: string;
  eventDate?: Date;
  eventType?: string;
  eventLocation?: string;
};


interface IJudge {
  judgeId: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  invitedAt: Date;
}


export interface IFightCard {
  _id?: Schema.Types.ObjectId;

  participant1?: string;

  participant2?: string;

  status?: string;

  scores?: number[];

  fightCards?: {

    _id: Schema.Types.ObjectId;

    status: string;
    score: number

  }[];
}


export interface IFightResults {

  wins: {

    _id: any;

    participant1: string;

    participant2: string;

    status: string;

    score: number;

  }[];

  losses: {

    _id: any;

    participant1: string;

    participant2: string;

    status: string;

    score: number;

  }[];

}