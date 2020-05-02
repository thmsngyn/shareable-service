import { Request, Response } from "express";

export class AccountService {
  public welcomeMessage(req: Request, res: Response) {
    return res.status(200).send("Welcome to shareable-service REST API");
  }
}
