
import express  from 'express';
import { adminMiddleware } from '../../middlewares/auth';
import { EventController } from "./event.conroller";
 

const router = express.Router();



router.post('/create',adminMiddleware('eventManager'), EventController.createEvent);
router.get('/all-event',  EventController.getAllEvent);
router.get('/:id',  EventController.getSingleEvent);

router.post("/generate-fighter/:id", EventController.generateFighterCard);
router.patch("/update/:id",adminMiddleware('eventManager'), EventController.updateEvent);
router.delete("/:id", adminMiddleware('eventManager'), EventController.deleteEvent);
router.post("/generated-fighter-card/:id", adminMiddleware('eventManager'), EventController.generateFighterCard);




export const EventRoutes = router;