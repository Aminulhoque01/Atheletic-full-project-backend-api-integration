import mongoose from "mongoose";
import { Event } from "../event/event.models";

export const EventService = {
  uploadScores: async (
    eventId: string,
    scores: { fightCardId: string; status: string; score: number }[]
  ) => {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    event.fightCards.forEach((card) => {
      const scoreUpdate = scores.find(
        (s) => s.fightCardId === card._id.toString()
      );
      if (scoreUpdate) {
        card.status = scoreUpdate.status;
        card.score = scoreUpdate.score; // Set the score field explicitly
      }
    });

    await event.save();

    return Event.findById(eventId); // Fetch the updated event
  },
};

export const judgmentProfileService = {
  
  EventService,
};
