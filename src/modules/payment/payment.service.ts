import { IPaymentResult } from "./payment.interface";
import { PaymentModel } from "./payment.model";

// export const getAllPaymentFromDB = async (
//   page: number = 1,
//   limit: number = 10,
//   name?: string,
//   date?: string,
//   subscriptionName?: string,
//   userId?: string,
//   userName?:string,
//   location?:string,
// ): Promise<{ data: IPaymentResult[]; total: number }> => {
//   const skip = (page - 1) * limit;
//   const query: any = { isDeleted: false };

//   if (name) {
//     query["userDetails.name"] = { $regex: name, $options: "i" }; // Correct the field path for user name search
//   }
//   if (subscriptionName) {
//     query["subscriptionDetails.name"] = {
//       $regex: subscriptionName,
//       $options: "i",
//     }; // Correct the field path for subscription name search
//   }
//   if (userName) {
//     query["userName.firstName"] = {
//       $regex: userName,
//       $options: "i",
//     }; // Correct the field path for subscription name search
//   }
//   if (userId) {
//     query["userId.id"] = {
//       $regex: userId,
//       $options: "i",
//     }; // Correct the field path for subscription name search
//   }
//   if (location) {
//     query["userId.id"] = {
//       $regex: userId,
//       $options: "i",
//     }; // Correct the field path for subscription name search
//   };
//   if (date) {
//     const [day, month, year] = date.split("-").map(Number);
//     const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
//     const endDate = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, -1));
//     query.createdAt = { $gte: startDate, $lte: endDate };
//   }

//   const payments = await PaymentModel.aggregate<IPaymentResult>([
//     {
//       $lookup: {
//         from: "users",
//         localField: "userId",
//         foreignField: "_id",
//         as: "userDetails",
//       },
//     },
//     { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
//     {
//       $lookup: {
//         from: "subscriptions",
//         localField: "subscriptionId",
//         foreignField: "_id",
//         as: "subscriptionDetails",
//       },
//     },
//     {
//       $unwind: {
//         path: "$subscriptionDetails",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     { $match: query }, // Apply the query after $lookup and $unwind
//     {
//       $project: {
//         transactionId: 1,
//         amount: 1,
//         createdAt: 1,
//         userName: "$userDetails.firstName",
//         subscriptionName: "$subscriptionDetails.name",
//       },
//     },
//     { $sort: { date: -1 } },
//     { $skip: skip },
//     { $limit: limit },
//   ]);

//   const totalPayments = await PaymentModel.aggregate([
//     {
//       $lookup: {
//         from: "users",
//         localField: "userId",
//         foreignField: "_id",
//         as: "userDetails",
//       },
//     },
//     { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
//     {
//       $lookup: {
//         from: "subscriptions",
//         localField: "subscriptionId",
//         foreignField: "_id",
//         as: "subscriptionDetails",
//       },
//     },
//     {
//       $unwind: {
//         path: "$subscriptionDetails",
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     { $match: query },
//     { $count: "total" },
//   ]);

//   return { data: payments, total: totalPayments[0]?.total || 0 };
// };

export const getAllPaymentFromDB = async ({
  page = 1,
  limit = 10,
  userEmail,
  userName,
  userId,
  location,
}: {
  page: number;
  limit: number;
  userEmail?: string;
  userName?: string;
  userId?: string;
  location?: string;
}): Promise<{ data: any[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query: any = { isDeleted: false };

  if (userEmail) {
    query["userDetails.email"] = { $regex: userEmail, $options: "i" };
  }
  if (userName) {
    query["userDetails.firstName"] = { $regex: userName, $options: "i" };
  }
  if (userId) {
    query["userDetails._id"] = userId;
  }
  if (location) {
    query["userDetails.location"] = { $regex: location, $options: "i" };
  }

  const payments = await PaymentModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },
    { $match: query },
    {
      $project: {
        transactionId: 1,
        amount: 1,
        createdAt: 1,
        userName: "$userDetails.firstName",
        
        userImage: "$userDetails.image.publicFileURL",
        location: "$userDetails.location",
        userId: "$userDetails._id",
        email: "$userDetails.email",
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const total = await PaymentModel.countDocuments(query);

  return { data: payments, total };
};


export const getTotalAmount = async():Promise<number>=>{
  
  const result = await PaymentModel.aggregate([
    {
      $group:{
        _id:null,
        totalAmount:{$sum:"$amount"}
      }
    }
  ]);

  return result[0]?.totalAmount || 0
};



export const getTodayAmounts = async():Promise<number>=>{
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const result = await PaymentModel.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfDay, $lt: endOfDay },
        status: "completed", // Only count completed payments
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$amount" },
      },
    },
  ]);

  return result[0]?.totalEarnings || 0;
}