// types.d.ts

import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    auth0Id?: string; // Optional property for auth0Id
    userId?: string; // Optional property for userId
    // Add other custom properties as needed
  }
}
