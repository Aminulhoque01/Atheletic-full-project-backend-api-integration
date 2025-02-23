import mongoose, { Document, Types } from "mongoose";
interface IEarning {
  amount: number;
  date: Date;
  description?: string;
}

export type IPendingUser = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  movements: number;
  others: number;
  height: number;
  weight: number;
  sport: string;
  dateOfBirth: Date;
  gender: string;
  scores:number;
  company_Name:string;
  website:string,
  Address: string;
  company_Contact:string;
  owner_firstName:string;
  owner_lastName:string;
  phoneNumber:string;
  gym: string;
  fightRecord: object;
  location: string;
  boxing_short_video?: string;
  disable: string;
  // judgment
  judgmentExperience?: number;
  
  judgmentCategory?: string;
  experienceAwardDetails?: string;
  role: "fighter" | "admin" | "eventManager" | "judgment";
} & Document;

export type IUser = {
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  location?: string;
  address?: string;
  height?: number;
  weight?: number;
  weightClass?: string;
  trainingType?: string;
  isProUser: boolean;
  sport?: string;
  dateOfBirth?: Date;
  gym?: string;
  disable: string;
  interests: mongoose.Types.ObjectId[];
  image?: {
    publicFileURL: string;
    path: string;
  };
  role: string;
  status: "active" | "blocked";
  age: string;
  gender: string;
  scores:number;
  fightRecord?: object;
  boxing_short_video?:string;
  about: string;
  bio: string;
  earnings: number;
  isRegistered:boolean
  favorite: mongoose.Types.ObjectId[];
  movements: number;
  others: number;
  friendRequests:IFriendRequest[],
  friends:mongoose.Types.ObjectId[],
  blockedUsers:mongoose.Types.ObjectId[],
  // evemtManager
  company_Name:string;
  website:string,
  Address: string;
  company_Contact:string;
  owner_firstName:string;
  owner_lastName:string;
  phoneNumber:string;
  cuponCode: string;
  expiryDate: Date | null;
  activeDate: Date | null;
  isDeleted: boolean;
  fcmToken?: string;
  events: [string]

  // judgment
  judgmentExperience?: number;
  
  judgmentCategory?: string;
  experienceAwardDetails?: string;
 
} & Document;



export type IOTP = {
  email: string;
  otp: string;
  expiresAt: Date;
} & Document;


export interface FilterOptions {
  sport?: string;
  location?: string;
  trainingType?: string;
  weight?: string;
  sortBy?: string;
  order?: "asc" | "desc";
};

export interface IFriendRequest {
  sender: Types.ObjectId; // Reference to the sender of the friend request
  status: "pending" | "accepted" | "rejected"; // Status of the friend request
}