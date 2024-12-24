
import { IListing } from "./listing.interface";
import { ListingModel } from "./listing.model";


const listingCreate = async(payload: IListing):Promise<IListing | null> =>{
    const result = await ListingModel.create(payload);
    return result;
}
 
export const ListingService = {
    listingCreate
}