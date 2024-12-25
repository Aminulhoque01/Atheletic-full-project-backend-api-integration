import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";



// Extend the Express Request type to include the user property
interface AuthRequest extends Request {
  fighter?: jwt.JwtPayload | string; //user
}
interface AuthRequest extends Request {
  eventManager?: jwt.JwtPayload | string;
}

type role = "admin" | "fighter" | "eventManager";

// export const adminMiddleware = (role: string | string[]): RequestHandler => {
//   return async (
//     req: AuthRequest,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader?.split(" ")[1];

//     if (!token) {
//       res
//         .status(401)
//         .json({ success: false, message: "Access denied. No token provided." });
//       return;
//     }

//     if (!res || typeof res.status !== "function") {
//       console.error("Invalid response object passed to globalErrorHandler.");
//       res.status(500).json({ success: false, message: "Internal Server Error" });
//       return;
//     }


//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       res
//         .status(401)
//         .json({ message: "Invalid authorization header format" });
//       return;
//     }

//     const tokenFromHeader = authHeader.replace("Bearer ", "").trim();
//     let decoded;
//     try {
//       decoded = jwt.verify(tokenFromHeader, JWT_SECRET_KEY as string);
//     } catch (err) {
//       res.status(401).json({ message: "Invalid or expired token" });
//       return;
//     }

//     if (typeof decoded === "string") {
//       res.status(401).json({ message: "Invalid token" });
//       return;
//     }
//     req.user = decoded;

  
//     const adminId = req.user?.id;

//     if (!adminId) {
//       res.status(401).json({ message: "Admin ID is missing" });
//       return;
//     }

    

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

//       req.fighter = decoded; // Attach user data to request object

//       // Check if the user is admin
//       if (
//         role &&
//         (req.fighter as jwt.JwtPayload & { role: string }).role !== role
//       ) {
//         res.status(403).json({
//           success: false,
//           message: "You are not authorized",
//         });
//         return;
//       }
//     } catch (error) {
//       res.status(400).json({ success: false, message: "Invalid token!" });
//       return;
//     }
//     next();
//   };
// };

// export const adminMiddleware = (role: string): RequestHandler => {

//   return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {

//     if (req.user.role !== role) {

//       res.status(403).json({ message: "Forbidden" });
//       return;

//     }

//     next();

//   };

// };



// export function adminMiddleware(...allowedRoles: string[]): RequestHandler {

//   return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

//     // Middleware logic
//     const userRole = req.user?.role;

//     const someCondition = false; // Replace with actual condition
//     if (someCondition) {

//       res.status(403).json({ message: "Forbidden" });

//       return;

//     }

//     if (allowedRoles.includes(userRole)) {
//       return next(); // User has access
//     }

//     next();

//   };

// }



export const adminMiddleware = (role: string | string[]): RequestHandler => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ success: false, message: "Invalid authorization header format" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ success: false, message: "Access denied. No token provided." });
      return;
    }

    let decoded: jwt.JwtPayload;
    try {
      const SECRET_KEY = process.env.JWT_SECRET_KEY as string;
      decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
    } catch (err) {
      res.status(401).json({ success: false, message: "Invalid or expired token" });
      return;
    }

    req.user = decoded;

    if (!req.user?.role || !req.user.id) {
      res.status(401).json({ success: false, message: "Invalid token data" });
      return;
    }

    const userRole = req.user.role;
    if (Array.isArray(role)) {
      if (!role.includes(userRole)) {
        res.status(403).json({
          success: false,
          message: "You are not authorized",
        });
        return;
      }
    } else if (userRole !== role) {
      res.status(403).json({
        success: false,
        message: "You are not authorized",
      });
      return;
    }

    next();
  };
};
