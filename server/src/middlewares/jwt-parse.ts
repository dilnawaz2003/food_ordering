import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user-model";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      auth0Id?: string;
    }
  }
}

const jwtParse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.includes("Bearer")) {
      res.status(404).json({ message: "Unable to parse ID" });
    }

    const token = authorization?.split(" ")[1];

    const decodedToken = jwt.decode(token!) as jwt.JwtPayload;

    const auth0Id = decodedToken?.sub;

    const user = await userModel.findOne({ auth0Id });

    if (!user) throw new Error("Unable to find user");

    req.auth0Id = user.auth0Id as string;
    req.userId = user._id.toString();

    console.log(" parse passed moving to next ");

    next();
  } catch (error) {
    console.log(error);
    res.status(401).send();
  }
};

export default jwtParse;
