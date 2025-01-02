import { UserModel } from "../user/user.model";
import { IWithdrawalRequest } from "./withdraw.interface";
import { WithdrawalRequest } from "./withdraw.model";

// interface IWithdrawalRequest {
//   managerId: string;
//   amount: number;
//   status: string;
// }

const sendWithdrawalRequest = async (managerId: string, amount: number): Promise<IWithdrawalRequest> => {
    const manager = await UserModel.findById(managerId);
    if (!manager) {
      throw new Error("Event manager not found");
    }
  
    // Ensure the manager has enough earnings
    if (manager.earnings < amount) {
      throw new Error("Insufficient earnings for withdrawal");
    }
  
    // Create the withdrawal request
    const withdrawalRequest = await WithdrawalRequest.create({
      managerId,
      amount,
      status: "pending",
    });

    return withdrawalRequest;
  
};

const getAllWithdrawalRequests = async(status:string):Promise<IWithdrawalRequest[]> =>{
    const query: any = {};
    if (status) {
      query.status = status;
    }
  
    // Fetch withdrawal requests
    const withdrawalRequests = await WithdrawalRequest.find(query).populate("managerId", "owner_firstName  owner_lastName email");
  
    return withdrawalRequests;
}

export const withdrawRequestService = {
    sendWithdrawalRequest,
    getAllWithdrawalRequests,
}