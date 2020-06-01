import { Request } from "express";

// declare module "express" {
//   export interface Request {
//     spotifyToken: string;
//   }
// }

// declare module "express-serve-static-core" {
//   export interface Request {
//     spotifyToken: string;
//   }
// }

declare global {
  namespace Express {
    export interface Request {
      spotifyToken: string;
    }
  }
}
