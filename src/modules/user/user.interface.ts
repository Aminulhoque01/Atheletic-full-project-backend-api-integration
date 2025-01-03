import mongoose, { Document } from "mongoose";
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

  height: number;
  weight: number;
  sport: string;
  dateOfBirth: Date;
  gender: string;
  company_Name:string;
  website:string,
  company_Address: string;
  company_Contact:string;
  owner_firstName:string;
  owner_lastName:string;
  phoneNumber:string;
  gym: string;
  fightRecord: object;
  location: string;
  disable: string;
  role: "fighter" | "admin" | "eventManager";
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
  fightRecord?: object;
  about: string;
  bio: string;
  earnings: number;
  isRegistered:boolean
  // evemtManager
  company_Name:string;
  website:string,
 company_Address: string;
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
 
} & Document;

export type IOTP = {
  email: string;
  otp: string;
  expiresAt: Date;
} & Document;
