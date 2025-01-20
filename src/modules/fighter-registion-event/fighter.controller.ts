import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import httpStatus from "http-status";
import { TournamentService } from "./fighter.service";
import { Error } from "mongoose";
import sendError from "../../utils/sendError";
import { JWT_SECRET_KEY } from '../../config';
import { Event } from "../event/event.models";
import { TournamentModel } from "./fighter.model";
import { UserModel } from "../user/user.model";
import nodemailer from "nodemailer";
import { ITournament } from "./fighter.interface";


// const requestWithdrawal = catchAsync(async (req: Request, res: Response) => {
//     // const managerId = req.user.id; // Assumes `req.user` is populated
//     const { bankName, accountType, accountNumber, withdrawalAmount,managerId } = req.body;

//     const wallet = await TournamentService.requestWithdrawal(managerId, {
//         bankName,
//         accountType,
//         accountNumber,
//         withdrawalAmount,
//     });

//     sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: "Withdrawal request submitted successfully!",
//         data: wallet,
//     });
// });

// const registerFighter = catchAsync(async (req: Request, res: Response): Promise<void> => {
//     const { eventID,  amount } = req.body;

//     const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return sendError(res, httpStatus.UNAUTHORIZED, {
//       message: "No token provided or invalid format.",
//     });
//   }

//   const token = authHeader.split(" ")[1];
//   const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };
//   const userId = decoded.id;

//   if (!userId) {
//     throw new Error("User ID or manager ID is required.");
//   }

//     const fighter = await UserModel.findById(userId);
//     if (!fighter) {
//         res.status(404).json({ message: 'Fighter not found' });
//         return;
//     }

//     const event = await Event.findById(eventID).populate<{ manager: { email: string, firstName?: string } }>("manager");
//     if (!event) {
//         res.status(404).json({ message: 'Event not found' });
//         return;
//     }

//     if (!amount || amount !== event.eventEntryFee) {
//         res.status(400).json({ message: 'Please pay the correct event price.' });
//         return;
//     }

//     if (!event.statistics) {
//         event.statistics = { registrations: 0, paymentStatus: { paid: 0, unpaid: 0 } };
//     }

//     event.statistics.registrations += 1;
//     await event.save();

//     // Add event to fighter's list
//     if (!fighter.events.includes(eventID)) {
//         fighter.events.push(eventID);
//         await fighter.save();
//     }

//     // Check if enough fighters are registered
//     const fighters = await UserModel.find({ events: eventID, role: 'fighter' }).select('_id');

//     if (fighters.length % 2 === 0) {
//         // Create tournament if even number of fighters
//         const tournament = await TournamentService.createTournament(eventID, fighters.map((f) => f._id.toString()));
//         res.status(200).json({
//             message: 'Tournament created successfully',
//             tournament,
//         });
//         return;
//     }


//     // Notify Event Manager
//     const manager = event.manager;
//     console.log(manager.email)
//     if (manager?.email) {
//         try {
//             const transporter = nodemailer.createTransport({
//                 service: "gmail",
//                 auth: {
//                     user: process.env.EMAIL_USER,
//                     pass: process.env.EMAIL_PASSWORD,
//                 },
//             });

//             const mailOptions = {
//                 from: process.env.EMAIL_USER,
//                 to: manager.email,
//                 subject: "New Fighter Registration",
//                 text: `Hello ${manager.firstName || "Event Manager"},\n\n` +
//                     `A new fighter (${fighter.firstName} ${fighter.lastName}) has registered for your event (${event.eventName}).\n\n` +
//                     `Thank you.`,
//             };

//             await transporter.sendMail(mailOptions);
//             console.log("Notification email sent to event manager.");
//         } catch (error) {
//             if (error instanceof Error) {
//                 console.error("Error sending email:", error.message);
//             } else {
//                 console.error("Error sending email:", error);
//             }
//         }
//     } else {
//         console.warn("Event manager email not available.");
//     }

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Fighter registered successfully and send to notification eventManager. Waiting for more registrations to create a tournament.',
//         data: event,
//     });
// });



const registerFighter = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { eventID, amount } = req.body;

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return sendError(res, httpStatus.UNAUTHORIZED, {
            message: "No token provided or invalid format.",
        });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as { id: string };
    const userId = decoded.id;

    if (!userId) {
        throw new Error("User ID or manager ID is required.");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    const event = await Event.findById(eventID).populate<{ manager: { _id: any; email: string, firstName?: string } }>("manager");
    if (!event) {
        res.status(404).json({ message: 'Event not found' });
        return;
    }

    // Prevent event manager from registering as a fighter
    if (event.manager && event.manager._id.toString() === userId) {
        res.status(403).json({ message: 'Event manager cannot register as a fighter.' });
        return;
    }

    // Check if the user is already registered for the event
    if (user.events.includes(eventID)) {
        res.status(400).json({ message: 'User is already registered for this event.' });
        return;
    }

    // Validate the payment amount
    if (user.role === 'fighter' && (!amount || amount !== event.eventEntryFee)) {
        res.status(400).json({ message: 'Please pay the correct event price.' });
        return;
    }

    // Add event to user's list
    user.events.push(eventID);
    await user.save();

    // If the user is a fighter, update event statistics and check for tournament creation
    if (user.role === 'fighter') {
        if (!event.statistics) {
            event.statistics = { registrations: 0, paymentStatus: { paid: 0, unpaid: 0 } };
        }

        event.statistics.registrations += 1;
        await event.save();

        const fighters = await UserModel.find({ events: eventID, role: 'fighter' }).select('_id');

        if (fighters.length % 2 === 0) {
            const tournament = await TournamentService.createTournament(eventID, fighters.map((f) => f._id.toString()));
            res.status(200).json({
                message: 'Tournament created successfully',
                tournament,
            });
            return;
        }
    }

    // Notify Event Manager
    if (event.manager?.email) {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: event.manager.email,
                subject: "New Registration",
                text: `Hello ${event.manager.firstName || "Event Manager"},\n\n` +
                    `A new ${user.role} (${user.firstName} ${user.lastName}) has registered for your event (${event.eventName}).\n\n` +
                    `Thank you.`,
            };

            await transporter.sendMail(mailOptions);
            console.log("Notification email sent to event manager.");
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error sending email:", error.message);
            } else {
                console.error("Error sending email:", error);
            }
        }
    } else {
        console.warn("Event manager email not available.");
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User registered successfully. Notification sent to the event manager.',
        data: event,
    });
});






const getAllTournament = catchAsync(async (req: Request, res: Response) => {
    const tournaments = await TournamentService.getAllTournaments();

    sendResponse<ITournament[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'get all tournament tournaments.',
        data: tournaments,
    });
})

const getEventRegistrations = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { eventID } = req.body;

    if (!eventID) {
        res.status(400).json({ message: "Event ID is required." });
        return;
    }

    const fighters = await UserModel.find({ role: 'fighter', events: eventID }).select('_id firstName lastName');

    if (!fighters || fighters.length === 0) {
        res.status(404).json({ message: "No fighters registered for this event." });
        return;
    }

    const totalRegistrations = fighters.length;
    const fighterIDs = fighters.map(fighter => fighter._id);

    res.status(200).json({
        message: "Fighter registration details fetched successfully.",
        totalRegistrations,
        fighterIDs,
        fighters, // Optional: includes additional details like names
    });
});




export const FighterController = {
    // requestWithdrawal,
    registerFighter,
    getAllTournament,
    getEventRegistrations

}