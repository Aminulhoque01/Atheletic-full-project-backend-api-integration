import mongoose, { Schema } from "mongoose";
import { IPendingUser, IUser, IOTP } from "./user.interface";

const PendingUserSchema = new Schema<IPendingUser>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    height: { type: Number },
    weight: { type: Number },
    sport: { type: String },
    gender: { type: String },
    dateOfBirth: { type: Date },
    gym: { type: String },
    fightRecord: {
      wins: { type: Number, required: true },
      losses: { type: Number, required: true },
      draws: { type: Number, required: true },
    },
    location: { type: String },
    company_Address: {
      type: String,
      // default:""
    },
    company_Contact: {
      type: String,
      // default:""
    },
    owner_firstName: {
      type: String,
      // default:""
    },
    owner_lastName: {
      type: String,
      // default:""
    },
    phoneNumber: {
      type: String,
      // default:""
    },

    role: {
      type: String,
      enum: ["admin", "fighter", "eventManager"],
    },
  },
  { timestamps: true }
);

export const PendingUserModel = mongoose.model<IPendingUser>(
  "PendingUser",
  PendingUserSchema
);

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    height: { type: Number },
    weight: { type: Number },
    sport: { type: String },
    gender: { type: String },
    dateOfBirth: { type: Date },
    gym: { type: String },
    disable: { type: String, enum: ["yes", "no"] },
    image: {
      type: {
        publicFileURL: { type: String, trim: true },
        path: { type: String, trim: true },
      },
      required: false,
      default: {
        publicFileURL: "/images/user.png",
        path: "public\\images\\user.png",
      },
    },
    role: {
      type: String,
      enum: ["admin", "fighter", "eventManager"],
      // default: "user",
          
    },
    status: {
      type: String,

      enum: ["active", "blocked"],
      default: "active", // Default value set to active
    },
    fightRecord: {
      wins: { type: Number,  },
      losses: { type: Number,   },
      draws: { type: Number,   },
    },
    weightClass: { type: String },
    trainingType: { type: String },
    isProUser: { type: Boolean, default: false },
    isRegistered:{type: Boolean, default: false},
    company_Name: {
      type: String,
    },
    location: { type: String },
    website: {
      type: String,
      default:"/images/user.png"
    },
    company_Address: {
      type: String,
      // default:""
    },
    company_Contact: {
      type: String,
      // default:""
    },
    owner_firstName: {
      type: String,
      // default:""
    },
    owner_lastName: {
      type: String,
      // default:""
    },
    phoneNumber: {
      type: String,
      // default:""
    },

    age: {
      type: String,
    },
    bio: {
      type: String,
    },
    about: {
      type: String,
    },

    interests:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      }
    ],
    earnings: { type: Number,  },
    cuponCode: {
      type: String, // Store the name of the promo code
      default: "", // Default value will be an empty string
    },
    expiryDate: {
      type: Date, // Store the name of the promo code
      default: null, // Default value will be an empty string
    },
    activeDate: {
      type: Date, // Store the name of the promo code
      default: null, // Default value will be an empty string
    },
    events: { type: [String], default: [] },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    fcmToken:{
      type: String,
      default:""
    }
    
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);



const OTPSchema = new Schema<IOTP>({
  email: { type: String, required: true, trim: true },
  otp: { type: String, required: true, trim: true },
  expiresAt: { type: Date, required: true },
});

export const OTPModel = mongoose.model<IOTP>("OTP", OTPSchema);
