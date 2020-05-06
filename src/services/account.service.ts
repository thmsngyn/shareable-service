import express, { Request, Response, Router } from "express";
import { MongooseDocument } from "mongoose";

import { SpotifyService } from "./spotify/spotify.service";
import { AccountModel } from "../models";

export class AccountService {
  private router: Router = undefined;

  constructor() {
    this.router = express.Router();
  }

  private dedupedUsers(accounts: any) {
    return Array.from<string>( // Filter our duplicates or the spotify API will blow up
      new Set(accounts.map((account: any) => account.spotifyUserId))
    );
  }

  private buildAccountWithFollowers(
    body: any,
    following: boolean[],
    allUsers: any[]
  ) {
    return new AccountModel({
      ...body,
      followers: following
        .map((isFollowing: boolean, index: number) => {
          if (isFollowing) {
            const spotifyUserId = allUsers[index];
            return { spotifyUserId }; // Mongo will also include _id for each of these users in the followers list... magic
          }
        })
        .filter(Boolean), // Filter out undefined
    });
  }

  public addAccountRequest(req: Request, res: Response) {
    let errors: Error[] = [];
    const { body } = req;
    const { token = "ADD-TOKEN-HERE" } = body;

    AccountModel.find({}, "spotifyUserId", (error: Error, accounts: any) => {
      if (error) {
        errors.push(error);
      }

      const userIds = this.dedupedUsers(accounts);
      SpotifyService.checkFollowers(token, userIds).then((following) => {
        // TODO: Handle errors
        console.log(following);
        const account = this.buildAccountWithFollowers(
          body,
          following,
          userIds
        );
        account.save((error: Error, account: MongooseDocument) => {
          if (error) {
            errors.push(error);
            res.json({ errors });
          }
          res.json(account);
        });
      });
    });
  }

  // TODO: On login, we will need to update the followers list for the user, it will be somewhat similar to
  // determining followers in the addAccountRequest
  public loginRequest(req: Request, res: Response) {}

  public getAllAccountsRequest(req: Request, res: Response) {
    AccountModel.find({}, (error: Error, accounts: MongooseDocument) => {
      if (error) {
        res.json({ error });
      }
      res.json(accounts);
    });
  }

  public deleteAccountRequest(req: Request, res: Response) {
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
