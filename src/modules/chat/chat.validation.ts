import {z } from "zod"
const MessageVallidationmSchema = z.object({
    body : z.object({
        senderId: z.string().nonempty("Sender ID is required"),
    receiverId: z.string().nonempty("Receiver ID is required"),
    text: z.string().nonempty("Text message is required"),
    })
  });


export const messageValidatio = {
    MessageVallidationmSchema
}