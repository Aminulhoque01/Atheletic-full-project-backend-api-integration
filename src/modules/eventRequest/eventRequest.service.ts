// import { EventRequestService } from "./eventRequest. controller";

import { IEventRequest } from "./eventRequest.interface";
import { EventRequest } from "./eventRequest.model";


const createEventRequestService = async (fighterID: string, eventID: string): Promise<IEventRequest> => {
    const eventRequest = new EventRequest({ fighterID, eventID });
    return eventRequest.save();
}



const getRequestsForEvent = async(eventID: string): Promise<IEventRequest[]> => {
    const result= EventRequest.find({eventID});
    return result;
}

const updateRequestStatus = async(requestID: string, status: "Pending" | "Approved" | "Rejected"): Promise<IEventRequest | null> => {
    const result = EventRequest.findByIdAndUpdate(requestID, {status}, {new: true});

    return result;
}

const getRequestsForFighter = async(fighterID: string): Promise<IEventRequest[]> => {
    const result = EventRequest.find({fighterID});
    return result;
}
const getAllRequests = async(): Promise<IEventRequest[]> => {
    const result = EventRequest.find();
    return result;
}

export const EventRequestService = {
    createEventRequestService,
    getRequestsForEvent,
    updateRequestStatus,
    getRequestsForFighter,
    getAllRequests
}

//   // Fetch all event requests for a specific event
//   static async getRequestsForEvent(eventID: string): Promise<IEventRequest[]> {
//     return EventRequest.find({ eventID });
//   }

//   // Fetch all requests for a specific fighter
//   static async getRequestsForFighter(fighterID: string): Promise<IEventRequest[]> {
//     return EventRequest.find({ fighterID });
//   }

