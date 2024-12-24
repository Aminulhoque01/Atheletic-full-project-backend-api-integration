import { Nodemailer_GMAIL, Nodemailer_GMAIL_PASSWORD } from "../../config";
import { Event } from "../event/event.models";
import { IFighter } from "./fighter.interface";
import { Fighter } from "./fighter.model";
import nodemailer from "nodemailer";

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
  eventId: string
): Promise<IFighter | null> => {
  // Check if the fighter exists
  const fighter = await Fighter.findById(fighterId);
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

  // Add event to fighter's list
  fighter.events.push(eventId);
  fighter.isRegistered = true;

  // Save the updated fighter
  await fighter.save();

  return fighter;
};

export const FighterService = {
  createFighter,
  registerForEvent,
};
