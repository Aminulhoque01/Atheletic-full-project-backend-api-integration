import express from "express"
import { ListingController } from "./listing.controller";




const router = express.Router();

router.post('/create', ListingController.createListing);
router.get('/all-listing-user', ListingController.getAllListings);
router.get('/', ListingController.getListingUser);
router.get('/pro-user', ListingController.getProUsers);


export const ListingRoutes= router;