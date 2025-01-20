import { UserModel } from "../user/user.model";
import { Match } from "./match.moduler";


// const createMatch = async (
//     fighter1Id: string,
//     fighter2Id: string,
//     movements: { fighter1: number; fighter2: number },
//     others: { fighter1: number; fighter2: number }
// ) => {
//     if (!movements || !others) {
//         throw new Error("Movements or others data is missing.");
//     }

//     const fighter1 = await UserModel.findById(fighter1Id);
//     const fighter2 = await UserModel.findById(fighter2Id);

//     if (!fighter1 || !fighter2) throw new Error("Fighter(s) not found.");

//     const totalScore1 = movements.fighter1 + others.fighter1;
//     const totalScore2 = movements.fighter2 + others.fighter2;

//     const winner = totalScore1 > totalScore2 ? fighter1._id : fighter2._id;

//     const match = await Match.create({
//         fighter1: fighter1Id,
//         fighter2: fighter2Id,
//         summary: { movements, others },
//         winner,
//     });

//     return match;
// };

// const createMatch = async (
//     fighter1Id: string,
//     fighter2Id: string,
//     movements: { fighter1: number; fighter2: number },
//     others: { fighter1: number; fighter2: number }
// ) => {
//     if (!movements || !others) {
//         throw new Error("Movements or others data is missing.");
//     }

//     const fighter1 = await UserModel.findById(fighter1Id);
//     const fighter2 = await UserModel.findById(fighter2Id);

//     if (!fighter1 || !fighter2) throw new Error("Fighter(s) not found.");

//     // Calculate total scores for each fighter
//     const totalScore1 = movements.fighter1 + others.fighter1;
//     const totalScore2 = movements.fighter2 + others.fighter2;

//     console.log(totalScore1)

//     // Determine winner and loser
//     const winner = totalScore1 > totalScore2 ? fighter1._id : fighter2._id;
//     const losser = totalScore1 > totalScore2 ? fighter2._id : fighter1._id;

//     // Calculate score difference
//     const scoreDifference = Math.abs(totalScore1 - totalScore2);

//     await UserModel.findByIdAndUpdate(
//         winner,
//         { $inc: { scores: scoreDifference } }, // Increment the winner's scores by winnerScore
//         { new: true } // Return the updated document
//     );

//     await UserModel.findByIdAndUpdate(
//         losser,
//         { $inc: { scores: -scoreDifference } }, // Decrement loser's scores
//         { new: true }
//     );

//     const match = await Match.create({
//         WinnerScores: scoreDifference, // Store the score difference if desired

//         summary: {
//             fighter1: {
//                 fighter1: fighter1Id,
//                 movements: movements.fighter1,
//                 others: others.fighter1,
//                 totalScore: totalScore1
//             },
//             fighter2: {
//                 fighter2: fighter2Id,
//                 movements: movements.fighter2,
//                 others: others.fighter2,
//                 totalScore: totalScore2
//             }
//         },
//         winner,
//         losser,
//     });

//     return match;
// };

const createMatch = async (
    eventId:string,
    fighter1Id: string,
    fighter2Id: string,
    movements: { fighter1: number; fighter2: number },
    others: { fighter1: number; fighter2: number }
) => {
    if (!movements || !others) {
        throw new Error("Movements or others data is missing.");
    }

    const fighter1 = await UserModel.findById(fighter1Id);
    const fighter2 = await UserModel.findById(fighter2Id);

    if (!fighter1 || !fighter2) throw new Error("Fighter(s) not found.");

    // Calculate total scores for each fighter
    const totalScore1 = movements.fighter1 + others.fighter1;
    const totalScore2 = movements.fighter2 + others.fighter2;

    // Determine winner and loser
    let winner, losser;
   
    // console.log(scoreDifference)

    if (totalScore1 > totalScore2) {
        winner = fighter1Id;
        losser = fighter2Id;
    } else if (totalScore2 > totalScore1) {
        winner = fighter2Id;
        losser = fighter1Id;
    } else {
        // Draw case
        winner = null;
        losser = null;
    }

    // Update fightRecord for fighter1
    await UserModel.findByIdAndUpdate(fighter1Id, {
        $inc: {
            'fightRecord.matchesPlayed': 1,
            'fightRecord.wins': winner === fighter1Id ? 1 : 0,
            'fightRecord.losses': losser === fighter1Id ? 1 : 0,
            'fightRecord.draws': !winner ? 1 : 0,
            'fightRecord.totalScore': totalScore1
        }
    });

    // Update fightRecord for fighter2
    await UserModel.findByIdAndUpdate(fighter2Id, {
        $inc: {
            'fightRecord.matchesPlayed': 1,
            'fightRecord.wins': winner === fighter2Id ? 1 : 0,
            'fightRecord.losses': losser === fighter2Id ? 1 : 0,
            'fightRecord.draws': !winner ? 1 : 0,
            'fightRecord.totalScore': totalScore2
        }
    });
    const scoreDifference = Math.abs(totalScore1 - totalScore2);
    console.log(scoreDifference)
    // Create the match
    const match = await Match.create({
        
        winnerScores: scoreDifference,

        event: eventId as string,
        fighters: [fighter1Id, fighter2Id],
        // winner: fighter1Id,
        // loser: fighter2Id,
        draw: false,
        scores: [
          { fighter: fighter1Id, score: 90 },
          { fighter: fighter2Id, score: 80 },
        ],
        summary: {
              
            fighter1: {
                fighter1: fighter1Id,
                movements: movements.fighter1,
                others: others.fighter1,
                totalScore:totalScore1
            },
            fighter2: {
                fighter2: fighter2Id,
                movements: movements.fighter2,
                others: others.fighter2,
                totalScore:totalScore2
            },
        },
        winner,
       
        losser,
        
        
    });

    return match;
};





const getMatch = async (matchId: string) => {

    // Fetch match details with populated user details
    const match = await Match.findById(matchId)
        .populate({
            path: "fighter1",
            select: "firstName lastName email role",
        })
        .populate({
            path: "fighter2",
            select: "firstName lastName email role",
        })
        .populate({
            path: "winner",
            select: "firstName lastName email role",
            match: { role: "fighter" }, // Ensure the winner has the "fighter" role
        });

    if (!match) {
        throw new Error("Match not found.");
    }

    return match;
};


const allwinner = async () => {
    const matches = await Match.find({})
        .populate({
            path: "winner",
            select: "firstName lastName email role scores",
            match: { role: "fighter" }, // Ensure only fighters are included
        });

    // Filter out matches where the winner is null (e.g., if not a fighter)
    const winners = matches.map((match) => match.winner).filter((winner) => winner !== null);

    return winners;
}

export const MatchService = {
    createMatch,
    getMatch,
    allwinner
}