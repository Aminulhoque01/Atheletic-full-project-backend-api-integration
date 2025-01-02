import { Nodemailer_GMAIL, Nodemailer_GMAIL_PASSWORD } from "../../config";
import { Event } from "../event/event.models";

import { UserModel } from "../user/user.model";
import { IFighter } from "./fighter.interface";
import { Fighter } from "./fighter.model";
import nodemailer from "nodemailer";
 // Adjust the path as necessary

const createFighter = async (payload: IFighter): Promise<IFighter | null> => {
  const fighter = await Fighter.create(payload);

 

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: Nodemailer_GMAIL,
      pass: Nodemailer_GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: payload.email,
    subject: 'Registration Confirmation',
    text: `Hi ${payload.name},\n\nYour registration was successful!\n\nThank you.`,
    
  };
  
  await transporter.sendMail(mailOptions);

  

  return fighter;
};

 const registerForEvent = async (
  fighterId: string,
  eventId: string,
  managerId:string,
  amount: number
):Promise<any> => {
  // Check if the fighter exists
  const fighter = await UserModel.findById(fighterId);
  if (!fighter) {
    throw new Error("Fighter not found");
  }

  // Check if the event exists
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  // Check if the fighter is already registered
  if (fighter.events.includes(eventId)) {
    throw new Error("Fighter is already registered for this event");
  }


  if (!managerId) {
    throw new Error("Event does not have a manager assigned");
  }

   // Verify the amount matches the event entry fee
  if (amount !== event.eventEntryFee) {
    throw new Error("Incorrect entry fee amount");
  }


   // Update EventManager earnings
   const manager = await UserModel.findById(managerId);
   if (!manager) {
    throw new Error("Event manager not found");


  }

  

  if (typeof manager.earnings !== 'number') {
    manager.earnings = 0; // Initialize to 0 if the value is invalid
  }
 
  
   
  manager.earnings += amount;
  await manager.save();


  // Add event to fighter's list
  fighter.events.push(eventId, );
  fighter.isRegistered = true;
  
  

  // Save the updated fighter
  await fighter.save();

  return fighter;


  
};

const getEventRegister = async () => {
  const result = await UserModel.find({ isRegistered: true, isProUser: true });
  return result;
}

export const FighterService = {
  createFighter,
  registerForEvent,
  getEventRegister
};
function handlePayment(amount: number) {
  throw new Error("Function not implemented.");
}

