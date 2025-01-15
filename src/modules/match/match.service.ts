import { UserModel } from "../user/user.model";
import { Match } from "./match.moduler";


const createMatch = async (
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

    const totalScore1 = movements.fighter1 + others.fighter1;
    const totalScore2 = movements.fighter2 + others.fighter2;

    const winner = totalScore1 > totalScore2 ? fighter1._id : fighter2._id;

    const match = await Match.create({
        fighter1: fighter1Id,
        fighter2: fighter2Id,
        summary: { movements, others },
        winner,
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