import { Router } from "express";
import { MatchConroller } from "./match.controller";
import { adminMiddleware } from "../../middlewares/auth";


const router= Router();

router.post("/create-match", adminMiddleware("judgment"), MatchConroller.createMatch);
router.get("/get-match",  MatchConroller.getMatch);
router.get("/getallwinner",  MatchConroller.getWinnerList);

export const MatchRoutes=router;