
import express from 'express';
import { adminMiddleware } from '../../middlewares/auth';
import { EventController } from "./event.conroller";
import upload from '../../middlewares/fileUploadNormal';
import { eventValidationRules } from './event.validation';


const router = express.Router();





router.post(
  "/create",
  upload.fields([
    { name: "eventLogo", maxCount: 1 },
    { name: "eventBanner", maxCount: 1 },
  ]),
  // eventValidationRules,
  adminMiddleware("eventManager"),
  EventController.createEvent
);
router.get("/my-event-history", adminMiddleware('eventManager'), EventController.myEventHistory);
router.get('/my-event', adminMiddleware(["eventManager", "fighter"]), EventController.getMyEvent);


router.get('/all-event', adminMiddleware(["fighter", "eventManager"]), EventController.getAllEvent);


router.get("/recentEvent", EventController.newrecentEvent);
router.get("/my-win-list", adminMiddleware("fighter"), EventController.getWonEvents)

router.get('/:id', EventController.getSingleEvent);



router.get("/result/:id", EventController.myEventResult);


router.get("/result/:id", adminMiddleware("fighter"), EventController.myEventResult);



// router.post("/generate-fighter/:id", EventController.generateFighterCard);
router.patch("/update/:id", adminMiddleware('eventManager'), EventController.updateEvent);
router.delete("/:id", adminMiddleware('eventManager'), EventController.deleteEvent);




// router.post("/upload-scores", adminMiddleware('judgment'), EventController.uploadScores);




export const EventRoutes = router;

function validateRequest(eventValidationRules: import("express-validator").ValidationChain[]): import("express-serve-static-core").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> {
  throw new Error('Function not implemented.');
}
