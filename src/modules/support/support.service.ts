import { SupportEmailModel } from "./support.model";

const createSupportEmail= async(userId: string, email: string, subject: string, message: string)=>{
    const supportEmail = await new SupportEmailModel({ userId, email, subject, message });
    return await supportEmail.save();
}

const getEmail = async()=>{
    const email= await SupportEmailModel.find();
    return email;
}

export const SupportEmailService = {
    createSupportEmail,
    getEmail
}