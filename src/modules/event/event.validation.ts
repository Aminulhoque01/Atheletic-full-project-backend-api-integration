import { body } from 'express-validator';
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

export const eventValidationRules = [
  body("eligibilityCriteria.age")
  .notEmpty()
  .withMessage("Eligibility criteria age is required."),
  body("eventCategories").isMongoId().withMessage("Invalid category ID."),
body("eligibilityCriteria.weightCategory")
  .notEmpty()
  .withMessage("Eligibility criteria weightCategory is required."),
body("eligibilityCriteria.discipline")
  .notEmpty()
  .withMessage("Eligibility criteria discipline is required."),
body("registrationOpenDateTime.RegistrationOpenDate")
  .notEmpty()
  .withMessage("Registration open date is required."),
body("registrationOpenDateTime.RegistrationOpenTime")
  .notEmpty()
  .withMessage("Registration open time is required."),

  body("finalEventDateTime.eventOpenDateline")
    .notEmpty()
    .withMessage("finalEventDateTime.eventOpenDateline is required."),
  body("finalEventDateTime.eventOpenTime")
    .notEmpty()
    .withMessage("finalEventDateTime.eventOpenTime is required."),
  body("finalEventDateTime.eventEndDateline")
    .notEmpty()
    .withMessage("finalEventDateTime.eventEndDateline is required."),
  body("finalEventDateTime.eventEndTime")
    .notEmpty()
    .withMessage("finalEventDateTime.eventEndTime is required."),
  body("eligibilityCriteria.age")
    .notEmpty()
    .withMessage("eligibilityCriteria.age is required."),
  body("eligibilityCriteria.weightCategory")
    .notEmpty()
    .withMessage("eligibilityCriteria.weightCategory is required."),
  body("eligibilityCriteria.discipline")
    .notEmpty()
    .withMessage("eligibilityCriteria.discipline is required."),

    body("pre_registrationOpenDateTime.Pre_RegistrationOpenDate")
    .notEmpty()
    .withMessage("Pre_RegistrationOpenDate is required."),
  body("pre_registrationOpenDateTime.Pre_RegistrationOpenTime")
    .notEmpty()
    .withMessage("Pre_RegistrationOpenTime is required."),
  body("pre_registrationOpenDateTime.Pre_RegistonLastDate")
    .notEmpty()
    .withMessage("Pre_RegistonLastDate is required."),
  body("pre_registrationOpenDateTime.Pre_RegistionLastTime")
    .notEmpty()
    .withMessage("Pre_RegistionLastTime is required."),
  body("registrationOpenDateTime.RegistrationOpenDate")
    .notEmpty()
    .withMessage("RegistrationOpenDate is required."),
  body("registrationOpenDateTime.RegistrationOpenTime")
    .notEmpty()
    .withMessage("RegistrationOpenTime is required."),
  body("fightCards")
    .isArray()
    .withMessage("fightCards must be an array.")
    .custom((cards) => cards.every((card: { participant1: any; participant2: any; }) => card.participant1 && card.participant2))
    .withMessage("Each fight card must include participant1 and participant2.")
  // Add more validation rules as needed
];