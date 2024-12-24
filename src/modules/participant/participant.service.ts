import { IParticipant } from "./participant.interface";
import { FighterCard, Participant } from "./participant.model"

const createParticipant = async(payload:IParticipant):Promise<IParticipant | null>=>{
    const participant = await Participant.create(payload);
    return participant;
}

const getAllParticipants= async()=>{
    const result= await Participant.find();
    return result;
};

const addFighterCard = async(participant:string[], eventDate: Date)=>{
    const fighterCard = await FighterCard.create({participant, eventDate});
    return fighterCard
}

export const ParticipantService={
    getAllParticipants,
    addFighterCard,
    createParticipant
}