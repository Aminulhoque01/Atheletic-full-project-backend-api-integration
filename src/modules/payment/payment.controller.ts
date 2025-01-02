 
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import httpStatus from "http-status";
import { Stripe } from "stripe";
// import { emitNotification } from "../../utils/socket";
import { JWT_SECRET_KEY, STRIPE_SECRET_KEY } from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendError from "../../utils/sendError";
import { UserModel } from "../user/user.model";
import sendResponse from "../../utils/sendResponse";
import { SubscriptionModel } from "../subscription/subscription.model";
import { PaymentModel } from "./payment.model";
import { getAllPaymentFromDB, getTodayAmounts, getTotalAmount } from "./payment.service";
import { format } from "date-fns";
import { PromoCodeModel } from "../promoCode/promoCode.model";
import { IPayment } from "./payment.interface";
import { loadStripe } from "@stripe/stripe-js";
import sendNotification from "../../utils/sendNotification";

// if (!STRIPE_SECRET_KEY) {
//   throw new Error("Stripe secret key is not defined");
// }

// const stripenPromise = loadStripe('stripe123');

// stripenPromise.then((stripen) => {
//   if (stripen) {
//     // Assuming you have a card element on the frontend
//     const elements = stripen.elements();
//     const cardElement = elements.create('card');
//     cardElement.mount('#card-element');
    
//     stripen.createPaymentMethod({
//       type: 'card',
//       card: cardElement,
//     }).then(({ paymentMethod, error }) => {
//       if (error) {
//         console.error(error);
//       } else {
//         console.log(paymentMethod);
//       }
//     });
//   }
// });

// const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });

// export const handlePayment = async (req: Request, res: Response) => {
//   const { amount, currency, paymentMethodId } = req.body;

//   if (!amount || !currency || !paymentMethodId) {
//     return res.status(400).json({
//       success: false,
//       message: 'Missing required fields: amount, currency, or paymentMethodId',
//     });
//   }

//   try {
//     const paymentIntent = await processPayment(amount, currency, paymentMethodId);

//     res.status(200).json({
//       success: true,
//       message: 'Payment successful',
//       paymentIntent,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//       error,
//     });
//   }
// };




export const paymentCreate = catchAsync(async (req: Request, res: Response) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, httpStatus.UNAUTHORIZED, {
        message: "No token provided or invalid format.",
      });
    }

    const token = authHeader.split(" ")[1]; // Get the token part from the 'Bearer <token>'
    const decoded = jwt.verify(token, JWT_SECRET_KEY as string) as {
      id: string;
      firstName: string;
      email:string
    };
    const userId= decoded.id;
    const userName = decoded.firstName;
    const userEmail = decoded.email;
   
    const { subscriptionId, amount, transactionId } = req.body; // Accept amount and subscriptionId from body

    if (!transactionId) {
      return sendError(res, httpStatus.UNAUTHORIZED, {
        message: "Failed to purchase!",
      });
    }

    // Fetch the user by ID
    const user = await UserModel.findById(userId,userName);
    if (!user) {
      return sendError(res, httpStatus.NOT_FOUND, {
        message: "User not found.",
      });
    }
    if (user.cuponCode) {
      // Fetch the promo code details
      const promoCode = await PromoCodeModel.findOne({ code: user.cuponCode });

      // Calculate the duration from the promo code
      const numericDuration = parseInt(promoCode?.duration || "0", 10);
      const durationUnit = promoCode?.duration.includes("year")
        ? "year"
        : "month";

      // Calculate the end date
      const currentDate = new Date();
      const endDate = new Date(currentDate);

      if (durationUnit === "year") {
        endDate.setFullYear(currentDate.getFullYear() + numericDuration);
      } else {
        endDate.setMonth(currentDate.getMonth() + numericDuration);
      }

      // Format the end date as a readable string
      const formattedEndDate = endDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Dynamic message based on the duration
      const message = `You have a coupon code. This app is free for you until ${formattedEndDate}!`;

      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message, // Use the dynamic message
        data: null,
        pagination: undefined,
      });
    }
    // Validate subscriptionId
    const subscription = await SubscriptionModel.findById(subscriptionId);
    if (!subscription) {
      return sendError(res, httpStatus.NOT_FOUND, {
        message: "Subscription not found.",
      });
    }

    // Ensure subscriptionDuration is a number
    const subscriptionDuration =
      typeof subscription.duration === "number"
        ? subscription.duration
        : parseInt(subscription.duration as string, 10) || 12;

    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setMonth(currentDate.getMonth() + subscriptionDuration);

    // If the day of expiry is invalid (e.g., Feb 31), it will roll over to the next valid day
    if (expiryDate.getDate() !== currentDate.getDate()) {
      expiryDate.setDate(0); // Adjust to the last valid day of the previous month
    }

    // Store the expiry date in both the PaymentModel and UserModel
    const paymentData = {
      transactionId,
      userId: user._id,
      userName:user.firstName,
      userEmail:user.email,
      subscriptionId, // Store the subscription ID
      amount, // Payment amount
      date: new Date(),
      expiryDate: expiryDate, // Store the actual Date object for expiry in PaymentModel
      paymentData: {}, // You may want to include actual payment data here
      status: "completed",
      isDeleted: false,
    };

    // Create the payment record
    const newPayment = await PaymentModel.create(paymentData);

    // Update the user's expiry date in the UserModel
    await UserModel.findByIdAndUpdate(
      userId,
      
      {
        expiryDate: expiryDate, // Store the actual expiry date
        activeDate: new Date(), // Store the current date as activeDate
      },
      { new: true },
    );

    // Format the expiry date as a readable string for response
    const day = expiryDate.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";
    const formattedExpiryDate = `${day}${suffix} ${expiryDate.toLocaleString("en-US", { month: "long" })} ${expiryDate.getFullYear()}`;

    // Emit notifications after successful payment
    await sendNotification({
      title: "Subscription Purchase",
      message: `You successfully purchased the subscription! It is valid until ${formattedExpiryDate}.`,
      recipientType: "user",
      recipientId: user._id,
      userId: user._id,
      userMsg: `You successfully purchased the subscription! It is valid until ${formattedExpiryDate}.`,
      adminMsg: `${user.firstName} purchased a subscription with the transaction ID: "${transactionId}".`,
    });

    // Send success response with the formatted expiry date
    return sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Payment completed successfully!",
      data: {
        ...newPayment.toObject(),
        expiryDate: formattedExpiryDate, // Send the formatted expiry date in the response
      },
      pagination: undefined,
    });
  } catch (error) {
    console.error("Error during payment processing:", error);
    return sendError(res, httpStatus.INTERNAL_SERVER_ERROR, {
      message: "Internal server error",
    });
  }
});

export const getAllPayment = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  // const name = req.query.name as string;
  const date = req.query.date as string;
  const subscriptionName = req.query.subscriptionName as string;
  const userId = req.query._id as string;
  const userName = req.query.firstName as string;
  const userEmail = req.query.email as string;
 
  
  const result = await getAllPaymentFromDB(
    page,
    limit,
    userEmail,
    date,
    subscriptionName,
    userId,
    userName,

  );

  if (result.data.length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "No purchased history",
      data: {
        payments: {},  //[]
      },
      pagination: {
        totalPage: Math.ceil(result.total / limit),
        currentPage: page,
        prevPage: page > 1 ? page - 1 : 1,
        nextPage: result.data.length === limit ? page + 1 : page,
        limit,
        totalItem: result.total,
      },
    });
  }
  //console.log(result.data,"finding date")
  const formattedPayments = result.data.map((payment: any) => ({
    transactionId: payment.transactionId,
    amount: payment.amount,
    userName: payment.userName,
    userEmail: payment.email,
    userId: payment._id,
    subscriptionName: payment.subscriptionName,
    date: format(new Date(payment.createdAt), "do MMMM, yyyy"), // Format the date using date-fns
  }));

  // await UserModel.findByIdAndUpdate(
  // {  
  //   userName
    
  // },
  
  //   { new: true },
  // );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments retrieved successfully.",
    data: {
      payments: formattedPayments,
    },
    pagination: {
      totalPage: Math.ceil(result.total / limit),
      currentPage: page,
      prevPage: page > 1 ? page - 1 : 1,
      nextPage: result.data.length === limit ? page + 1 : page,
      limit,
      totalItem: result.total,
    },
  });
});


export const getAllAmount = catchAsync(async(req:Request, res:Response)=>{
  const totalAmount = await getTotalAmount();

  sendResponse<number>(res,{
    statusCode: httpStatus.OK,
    success: true,
    message: "Amount retrieved successfully.",
    data: totalAmount,
    pagination: undefined
  })
});

export const getTodayAmount= catchAsync(async(req:Request, res:Response)=>{
  const todayAmount = await getTodayAmounts();
  
  sendResponse<number>(res,{
    statusCode: httpStatus.OK,
    success: true,
    message: "Amount retrieved successfully.",
    data: todayAmount,
    pagination: undefined
  })
})
// const processPayment = async (amount: number, currency: string, paymentMethodId: string) => {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // Stripe expects the amount in cents
//       currency,
//       payment_method: paymentMethodId,
//       confirm: true,
//     });

//     return paymentIntent;
//   } catch (error) {
//     console.error("Error processing payment:", error);
//     throw new Error("Payment processing failed");
//   }
// };

