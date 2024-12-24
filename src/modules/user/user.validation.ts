import { z } from "zod";

interface ValidationResult {
  isOk: boolean;
  message: string;
}

export const validateUserInput = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  // height: number,
  // weight: number,
  // sport: string,
  // dateOfBirth: Date,
  // gym: string,
  // company_Name: string,
  // website: string,
  // company_Address: string,
  // company_Contact: string,
  // owner_firstName: string,
  // owner_lastName: string,
  // phoneNumber: string,
  // age: string,
 

): ValidationResult | null => {
  if (!firstName|| !lastName || !email || !password) {
    return { isOk: false, message: "Please fill all the fields" };
  }
  if (password.length >= 5) {
    return { isOk: false, message: "Password must be at least 5 characters" };
  }
  return null;



  // if (age.length < 1) {
  //   return { isOk: false, message: "Please enter your age" };
  // }
 
  // if(!company_Name){
  //   return { isOk: false, message: "Please enter your company name" };
  // }
  // if(!website){
  //   return { isOk: false, message: "Please enter your website" };
  // }
  // if(!company_Address){
  //   return { isOk: false, message: "Please enter your company address" };
  // }
  // if(!company_Contact){
  //   return { isOk: false, message: "Please enter your company contact" };
  // }
  // if(!owner_firstName){
  //   return { isOk: false, message: "Please enter your owner first name" };
  // }
  // if(!owner_lastName){
  //   return { isOk: false, message: "Please enter your owner last name" };
  // }
  // if(!phoneNumber){
  //   return { isOk: false, message: "Please enter your phone number" };
  // }
  // if(!gym){
  //   return { isOk: false, message: "Please enter your gym" };
  // }
  // if(!dateOfBirth){
  //   return { isOk: false, message: "Please enter your date of birth" };
  // }
  // if(!sport){
  //   return { isOk: false, message: "Please enter your sport" };
  // }
  // if(!weight){
  //   return { isOk: false, message: "Please enter your weight" };
  // }
  // if(!height){
  //   return { isOk: false, message: "Please enter your height" };
  // }
  // if(!email){
  //   return { isOk: false, message: "Please enter your email" };
  // }
  // if(!firstName){
  //   return { isOk: false, message: "Please enter your first name" };
  // }
  // if(!lastName){
  //   return { isOk: false, message: "Please enter your last name" };
  // }

  
};

export const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "email is required!",
        invalid_type_error: "email must be a string",
      })
      .email(),
    password: z.string({
      required_error: "password is required!",
      invalid_type_error: "password must be a string",
    }),
  }),
});

export const registerUserValidationSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: "name is required!",
      invalid_type_error: "name must be a string",
    }),
    lastName: z.string({
      required_error: "name is required!",
      invalid_type_error: "name must be a string",
    }),
    
    email: z
      .string({
        required_error: "email is required!",
        invalid_type_error: "email must be a string",
      })
      .email(),
    password: z
      .string({
        required_error: "password is required!",
        invalid_type_error: "password must be a string",
      })
      .min(8, "Password must be at least 8 characters long"),
  }),
});
