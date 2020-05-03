import { Request, Response } from "express";
import { MongooseDocument } from "mongoose";

import { AccountModel } from "../models";

export class AccountService {
  public welcomeMessage(req: Request, res: Response) {
    return res.status(200).send("Welcome to shareable-service REST API");
  }

  public static getAllAccounts(req: Request, res: Response) {
    AccountModel.find({}, (error: Error, account: MongooseDocument) => {
      if (error) {
        res.json({ error });
      }
      res.json(account);
    });
  }

  public static addAccount(req: Request, res: Response) {
    console.log(req.body);
    const newAccount = new AccountModel(req.body);
    newAccount.save((error: Error, account: MongooseDocument) => {
      if (error) {
        res.json({ error });
      }
      res.json(account);
    });
  }

  public static deleteAccount(req: Request, res: Response) {
    const accountId = req.params.id;
    AccountModel.findByIdAndDelete(accountId, (error: Error, deleted: any) => {
      if (error) {
        res.json({ error });
      }
      const message = deleted
        ? `Account ID ${accountId} deleted successfully`
        : `Account ID ${accountId} not found`;
      res.json({ message });
    });
  }
}
