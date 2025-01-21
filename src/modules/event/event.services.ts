import mongoose, { SortOrder } from "mongoose";
import { EventFilterableFields } from "./event.constant";
import { IEvent, IEventFilters, IFightCard } from "./event.interface";
import { Event } from "./event.models";
import { IpaginationsOptions } from "../../interface/paginations";
import { IGeneticResponse, PaginateResult } from "../../interface/commont";
import { paginationHelper } from "../../helpers/paginationHelper";
import { Match } from "../match/match.moduler";
import { UserModel } from "../user/user.model";

const createEvent = async (eventData: Partial<IEvent>): Promise<IEvent> => {
  const event = new Event(eventData);
  return await event.save();


};

const getEventsByManager = async (managerId: string) => {
  return await Event.find({ manager: new mongoose.Types.ObjectId(managerId) })
};

const getEventRestion = async () => {
  return await Event.find().populate("user");
};


// const getAllEvents= async () =>{
//   // Fetch all events (for fighters or admins)
//   return await Event.find();
// }


const getAllEvent = async (
  filters: IEventFilters,
  pagination: IpaginationsOptions
): Promise<PaginateResult<IEvent>> => {
  const { searchTerm, ...filterFields } = filters;
  const { page, limit, sortBy, sortOrder } = pagination;

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: EventFilterableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filterFields).length > 0) {
    andConditions.push(
      ...Object.entries(filterFields).map(([field, value]) => ({
        [field]: value,
      }))
    );
  }

  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = sortBy
    ? { [sortBy]: sortOrder === 'asc' ? 1 : -1 }
    : { createdAt: -1 };

  const skip = (page - 1) * limit;

  const result = await Event.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate("eventCategories");

  const total = await Event.countDocuments(whereConditions);

  return {
    meta: { page, limit, total },
    data: result,
  };
};


const getSingleEvent = async (id: string): Promise<IEvent | null> => {
  const result = await Event.findById(id);
  return result;
};


const getRecentEvent = async () => {

  const result = await Event.find().sort({ createdAt: -1 });
  // console.log(`sdfsdfsdf`,result)
  return result
};

const eventUpdate = async (
  id: string,
  payload: Partial<IEvent>
): Promise<IEvent | null> => {

  const result = await Event.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const eventDelete = async (id: string): Promise<IEvent | null> => {
  const result = await Event.findByIdAndDelete(id);
  return result;
};

const generateFighter = async (id: string): Promise<IEvent | null> => {
  const event = await Event.findById(id);
  if (!event) throw new Error("Event not found");

  // Example pairing logic
  const participants = event.fightCards.map((card) => ({
    _id: card._id,
    participant1: card.participant1,
    participant2: card.participant2,
    status: card.status,
  }));

  const pairedFightCards = [];

  for (let i = 0; i < participants.length; i += 2) {
    if (participants[i + 1]) {
      pairedFightCards.push({
        _id: new mongoose.Types.ObjectId(),
        participant1: participants[i].participant1,
        participant2: participants[i + 1].participant2,
        status: "Scheduled",
        score: 0
      });
    }
  }

  // event.fightCards = pairedFightCards;
  await event.save();
  return event;
};






const getMyEventResults= async (fighterId: string, eventId: string) => {
  // Fetch all matches for the fighter in the specified event
  const matches = await Match.find({
    event: eventId,
    fighters: fighterId,
  })
    .populate("winner", "_id") // Get winner ID
    .populate("loser", "_id") // Get loser ID
    .populate("winnerScores", "_id"); // Get loser ID

  // Initialize counts
  let wins = 0;
  let losses = 0;
  let draws = 0;
  let winnerScores=0;

  // Loop through matches to calculate wins, losses, and draws
  matches.forEach((match) => {
    if (match.draw) {
      draws++;
    } else if (match.winner && match.winner._id.toString() === fighterId) {
      wins++;

      if (match.winnerScores) {
        winnerScores += match.winnerScores;
      }

    } 
    else {
      losses++;
    }
  });

  // Determine the overall event result
  let eventResult = "Draw"; // Default to Draw
  if (wins > losses) {
    eventResult = "Win";
  } else if (losses > wins) {
    eventResult = "Loss";
  }
  
  return {
    eventId,
    fighterId,
    wins,
    losses,
    draws,
    winnerScores,
    eventResult, // Final result
  };
};


// const getFighterWonEvents = async (fighterId: string) => {
//   // Fetch matches where the fighter is the winner
//   const matches = await Match.find({
//     winner: fighterId,
//   }).populate("event", "eventName"); // Populate event details with eventName

//   // Create a map to group wins by event
//   const eventWinCounts: Record<string, { event: any; wins: number }> = {};

//   matches.forEach((match) => {
//     const eventId = match.event._id.toString();
//     if (!eventWinCounts[eventId]) {
//       eventWinCounts[eventId] = { event: match.event, wins: 0 };
//     }
//     eventWinCounts[eventId].wins += 1;
//   });

//   // Retrieve events where the fighter has wins
//   const wonEvents = Object.values(eventWinCounts).map((entry) => ({
//     eventId: entry.event._id,
//     eventName: entry.event.eventName,
//     wins: entry.wins,
//   }));

//   return wonEvents;
// };


const getFighterWonEvents = async(fighterId: string) =>{
  try {
    // Query matches where the fighter is the winner
    const matches = await Match.find({ winner: fighterId })

      .populate({
        path: "event",
        select: "eventName eventType eventLocation finalEventDateTime", // Choose event fields to include
      })
      .exec();

    // Aggregate total winner scores and collect event details
    let totalWinnerScore = 0;
    const eventDetails = matches.map((match) => {
      return {
        eventId: match.event?._id, // Event ID
        eventName: match.event?.eventName, // Event name
        eventType: match.event?.eventType, // Event type
        eventLocation: match.event?.eventLocation, // Event location
        eventDate: match.event?.finalEventDateTime?.eventOpenDateline, // Event date
        winnerScores: match.winnerScores, // Fighter's score for the match
      };
    });

    // Return fighter's wins and total scores
    return {
      fighterId,
      totalWins: matches.length,
      totalWinnerScore,
      eventDetails,
    };
  } catch (error) {
    console.error("Error fetching fighter win details:", error);
    throw error;
  }
}

const getEventHistoryByManager= async(managerId:string)=>{
  const events = await Event.find({ manager: managerId }).sort({
    "registrationOpenDateTime.RegistrationOpenDate": -1,
  });

  return events;
}

const inviteJudgesToEvent = async (eventId: string, judgeIds: string[]) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found.");
  }

  const validJudges = await UserModel.find({ _id: { $in: judgeIds }, role: "judgment" });
  if (validJudges.length !== judgeIds.length) {
    const invalidJudges = judgeIds.filter(
      (judgeId) => !validJudges.some((judge) => judge._id.toString() === judgeId)
    );
    throw new Error(`Some judge IDs are invalid: ${invalidJudges.join(", ")}`);
  }

  judgeIds.forEach((judgeId) => {
    if (
      judgeId &&
      !event.invaitedjudges.some((j) => j.judgeId?.toString() === judgeId.toString())
    ) {
      event.invaitedjudges.push({ judgeId, status: "pending", invitedAt: new Date() });
    }
  });

  try {
    await event.save();
  } catch (error) {
    // throw new Error(`Error saving event: ${error.message}`);
    console.log(error)
  }

  return event;
};



export const EventService = {
  getAllEvent,
  getSingleEvent,
  eventUpdate,
  eventDelete,
  getFighterWonEvents,
  getMyEventResults,
  createEvent,
  getRecentEvent,
  getEventsByManager,
  getEventRestion,
  getEventHistoryByManager,
  inviteJudgesToEvent,

};
