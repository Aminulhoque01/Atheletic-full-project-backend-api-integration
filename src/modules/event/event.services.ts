import { SortOrder } from "mongoose";
import { EventFilterableFields } from "./event.constant";
import { IEvent, IEventFilters } from "./event.interface";
import { Event } from "./event.models";
import { IpaginationsOptions } from "../../interface/paginations";
import { IGeneticResponse } from "../../interface/commont";
import { paginationHelper } from "../../helpers/paginationHelper";

const createEvent = async (payload: IEvent): Promise<IEvent | null> => {
  const result = await Event.create(payload,);

  return result;
};

const getAllEvent = async (
  filters: IEventFilters,
  pagination: IpaginationsOptions
): Promise<IGeneticResponse<IEvent[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: EventFilterableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Event.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Event.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleEvent = async (id: string): Promise<IEvent | null> => {
  const result = await Event.findById(id);
  return result;
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
  const participants = event.fightCards.map((card) => [card.participant1, card.participant2]).flat();
  const pairedFightCards = [];

  for (let i = 0; i < participants.length; i += 2) {
    if (participants[i + 1]) {
      pairedFightCards.push({
        participant1: participants[i],
        participant2: participants[i + 1],
        status: "Scheduled",
      });
    }
  }

  event.fightCards = pairedFightCards;
  await event.save();
  return event;
};

export const EventService = {
  getAllEvent,
  getSingleEvent,
  eventUpdate,
  eventDelete,
  createEvent,
  generateFighter,
};
