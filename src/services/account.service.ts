import express, { Request, Response, Router } from "express";
import { MongooseDocument } from "mongoose";

import { SpotifyService } from "./spotify/spotify.service";
import { AccountModel } from "../models";

export class AccountService {
  private router: Router = undefined;

  // TODO: Remove temp token (for development)
  private token =
    "BQCJHjNl6EI3UE8rb9hkN9lLt2eUtSh14RGWZHvqCDqEDy1bQYsjaX1XKvSV4WazUNUiJb3AdEHqa3ejQC5X_REMaJjtFFL-dUUpHSS6vWOc0k7Dz7RabqrjvviL3b8qd4MncwDmP3k9xbuYH7mzhbqzo9q7kQMV_t2kH5HTrVpM5Hc74Y0s";

  constructor() {
    this.router = express.Router();
  }

  private buildFollowers(followings: boolean[], allAccounts: any[]) {
    return followings
      .map((isFollowing: boolean, index: number) => {
        if (isFollowing) {
          const spotifyUserId = allAccounts[index];
          return { spotifyUserId }; // Mongo will also include _id for each of these users in the followers list... magic
        }
      })
      .filter(Boolean); // Filter out undefined
  }

  private handleError(error: any, res: Response, options: any = {}) {
    const { fromSpotify, fromMongo } = options;

    if (error) {
      const {
        status = 500,
        message: spotifyErrorMessage,
        errmsg: mongooseErrorMessage,
        code: mongoErrorCode,
      } = error;
      const message =
        spotifyErrorMessage || mongooseErrorMessage || "Unknown error occurred";

      res
        .status(status)
        .json({ message, mongoErrorCode, fromSpotify, fromMongo });
    }
  }

  /**
   * Resolves latest followers for the current user and dispatches an action (given the followers)
   * @param action Action to dispatch, receives an object as a param with followers as a field
   * @param token Spotify access token
   * @param req Request
   * @param res Response
   */
  private resolveFollowersWithAction(
    action: Function,
    req: Request,
    res: Response
  ) {
    const { spotifyUserId, token = this.token } = req.body;

    // Find all users besides the current one
    AccountModel.find(
      { spotifyUserId: { $ne: spotifyUserId } }, // Exclude the current account from the request
      "spotifyUserId",
      (error: Error, allAccounts: any) => {
        // Something might've happened, so handle the error
        this.handleError(error, res, { fromMongo: true });

        const userIds = allAccounts.map(
          (account: any) => account.spotifyUserId
        );

        // Get a list of boolean values that map to the list of users to denote follower status
        SpotifyService.checkFollowers(token, userIds).then(
          (followings: any | boolean[]) => {
            const { error } = followings;
            // Something might've happened, so handle the error
            this.handleError(error, res, { fromSpotify: true });

            // These are the current user's followers
            const followers = this.buildFollowers(followings, userIds);
            const params = { followers };

            // Dispatch the subsequent action with params
            action(params);
          }
        );
      }
    );
  }

  public addAccountRequest(req: Request, res: Response) {
    const { body: accountToAdd } = req;

    // Object destructuring in the params of the function
    // Instantiates an AccountModel and adds an account
    const addAccountAction = ({ followers }: { followers: any[] }) => {
      const newAccount = new AccountModel({
        ...accountToAdd,
        followers,
      });

      newAccount.save((error: Error, account: MongooseDocument) => {
        this.handleError(error, res, { fromMongo: true });
        res.json(account);
      });
    };

    // Resolves latest followers and runs the addAccountAction
    this.resolveFollowersWithAction(addAccountAction, req, res);
  }

  public async loginRequest(req: Request, res: Response) {
    const { spotifyUserId, loggedIn = true } = req.body;

    // Find user and ensure they exist
    const exists = await AccountModel.exists({ spotifyUserId });
    if (!exists) {
      return this.handleError({ message: "Account doesn't exist" }, res);
    }

    // Finds and updates the account with the latest follower data and login status
    const updateLoginAction = ({ followers }: { followers: any[] }) => {
      AccountModel.findOneAndUpdate(
        { spotifyUserId },
        { $set: { followers, loggedIn } },
        { new: true },
        (error: Error, account: MongooseDocument) => {
          this.handleError(error, res, { fromMongo: true });
          res.json(account);
        }
      );
    };

    // Resolves latest followers and runs the loginAction
    this.resolveFollowersWithAction(updateLoginAction, req, res);
  }

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

    if (accountId === "all") {
      AccountModel.deleteMany({}, (error: Error) => {
        if (error) {
          res.json({ error });
        }
        res.json({ message: "All accounts deleted" });
      });
    } else {
      AccountModel.findByIdAndDelete(
        accountId,
        (error: Error, deleted: any) => {
          if (error) {
            res.json({ error });
          }
          const message = deleted
            ? `Account ID ${accountId} deleted successfully`
            : `Account ID ${accountId} not found`;
          res.json({ message });
        }
      );
    }
  }
}
