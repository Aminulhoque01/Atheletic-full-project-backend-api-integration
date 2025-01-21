// import { Nodemailer_GMAIL, Nodemailer_GMAIL_PASSWORD } from "../../config";
// import { Event } from "../event/event.models";

import { JWT_SECRET_KEY } from "../../config";
import catchAsync from "../../utils/catchAsync";
import { UserModel } from "../user/user.model";
import { ITournament } from "./fighter.interface";
import { TournamentModel, } from "./fighter.model";


// const requestWithdrawal= async(managerId: string, bankDetails: any)=> {
  
 
//   const { bankName, accountType, accountNumber, withdrawalAmount } = bankDetails;

//   // Check if sufficient funds are available
//   const wallet = await Wallet.findOne({ managerId });
//   if (!wallet || wallet.totalEarnings < withdrawalAmount) {
//     throw new Error("Insufficient funds.");
//   }


//   if (!wallet) {
//     throw new Error("Wallet not found for the manager.");
//   }

//   if (wallet.totalEarnings < withdrawalAmount) {
//     throw new Error("Insufficient funds. Your available balance is " + wallet.totalEarnings);
//   }
//   // Add withdrawal request
//   wallet.withdrawalRequests.push({
//     bankName,
//     accountType,
//     accountNumber,
//     withdrawalAmount,
//     status: "pending",
//   });

//   wallet.totalEarnings -= withdrawalAmount; // Deduct from total earnings
//   await wallet.save();

//   return wallet;
// }



// const createTournament = async (eventID: string, fighterIDs: string[],): Promise<any> => {
//   if (fighterIDs.length % 2 !== 0) {
//     throw new Error("Number of fighters must be even to create fight cards.");
//   }

//   // Sort fighters (as shown in the previous response)
//   const fighters = await UserModel.find({ _id: { $in: fighterIDs } }).select("height weight age");

//   fighters.sort((a, b) => {
//     if (a.weight !== b.weight) return a.weight - b.weight;
//     if (a.height !== b.height) return a.height - b.height;
//     return a.age - b.age;
//   });

//   // Generate fight cards
//   const fightCards = [];
//   const startDate = new Date(); // Start scheduling from now
//   let currentFightTime = startDate;

//   for (let i = 0; i < fighters.length; i += 2) {
//     fightCards.push({
//       participant1: fighters[i]._id,
//       participant2: fighters[i + 1]._id,
//       fightDate: currentFightTime, // Assign fight date and time
//       duration: 60, // Duration of 1 hour
//     });

//     // Increment time for the next fight
//     currentFightTime = new Date(currentFightTime.getTime() + 60 * 60 * 1000);
//   }

//   // Create and save tournament
//   const tournament = new TournamentModel({
//     eventID,
//     fightCards,
//   })

  
//    await tournament.save();
//   //  await Event.update({ eventID }, { $set: { fighterCards } });

//   return tournament;
// };


const createTournament = async (eventID: string, fighterIDs: string[]): Promise<any> => {
  if (fighterIDs.length % 2 !== 0) {
    throw new Error("Number of fighters must be even to create fight cards.");
  }

  const fighters = await UserModel.find({ _id: { $in: fighterIDs } }).select("height weight age");

  fighters.sort((a, b) => {
    if (a.weight !== b.weight) return a.weight - b.weight;
    if (a.height !== b.height) return a.height - b.height;
    return a.age - b.age;
  });

  const fightCards = [];
  const startDate = new Date(); // Start scheduling from now
  let currentFightTime = startDate;

  for (let i = 0; i < fighters.length; i += 2) {
    fightCards.push({
      participant1: fighters[i]._id,
      participant2: fighters[i + 1]._id,
      fightDate: currentFightTime,
      duration: 60,
    });

    currentFightTime = new Date(currentFightTime.getTime() + 60 * 60 * 1000);
  }

  const tournament = new TournamentModel({
    eventID,
    fightCards,
  });
  await tournament.save();

  // Update event's fighterCards field
  // await Event.update({ eventID }, { $set: { fightCards } });

  return tournament;
};




const getAllTournaments = async (): Promise<ITournament[]> => {
  const tournaments = await TournamentModel.find()
    .populate("eventID", "eventName eventDate eventLocation") // Populate event details
    .populate("fightCards.participant1", "firstName lastName") // Populate participant 1 details
    .populate("fightCards.participant2", "firstName lastName") // Populate participant 2 details
    .exec();

  return tournaments.map(tournament => tournament.toObject() as unknown as ITournament);
}




export const TournamentService = {
  createTournament,
  getAllTournaments,
  // requestWithdrawal
};


function handlePayment(amount: number) {
  throw new Error("Function not implemented.");
}

