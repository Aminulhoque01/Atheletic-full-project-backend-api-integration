import { z } from 'zod';

const eventValidated = z.object({
eventName: z.string({
    required_error: "Event name is required",
  }),
  eventCategories: z.date({
    required_error: "Event categories is required",
  }),
  eventLocation: z.string({
    required_error: "Event location is required",
  }),
  eventType:z.string({
    required_error:"event type is required"
  }),
  registrationOpenDateTime:z.string({
    required_error:"event register openDate time is required"
  }),
  registrationLastDateTime:z.string({
    required_error:"event registration last date and time is required"
  }),
  preRegistrationOpenDateTime:z.string({
    required_error:"event preRegistrationLastDateTime is required"
  }),
  preRegistrationLastDateTime:z.string({
    required_error: " event preRegistrationLastDateTime is required"
  }),
  finalEventDateTime:z.string({
    required_error:"finalEventDateTime is required"
  }),
  eventEndDateTime:z.string({
    required_error: "eventEndDateTime is required"
  }),
  chosenSports:z.string({
    required_error:"choseSports the event"
  }),
  eventEntryFee:z.string({
    required_error:"eventEntryFee is required"
  }),
  eventDescription:z.string({
    required_error:"event Description is required",
  })
});

export const EventValidation = {
   eventValidated,
};
