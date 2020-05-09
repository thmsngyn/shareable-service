import { Request, Response } from "express";
import { MongooseDocument } from "mongoose";

import { ShareableErrorCodes } from "../base-router-service/base-router.constants";
import { BaseRouterService } from "../base-router-service";
import { SpotifyService } from "../spotify/spotify.service";
import { AccountModel } from "../../models";

export class AccountService extends BaseRouterService {
  constructor() {
    super();
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
        this.handleError(error, res);

        const userIds = allAccounts.map(
          (account: any) => account.spotifyUserId
        );

        // Get a list of boolean values that map to the list of users to denote follower status
        SpotifyService.checkFollowers(token, userIds).then(
          (followings: any | boolean[]) => {
            const { error } = followings;

            if (error) {
              // Something might've happened, so handle the error
              this.handleError(error, res);
            } else {
              // These are the current user's followers
              const followers = this.buildFollowers(followings, userIds);
              const params = { followers };

              // Dispatch the subsequent action with params
              action(params);
            }
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
        this.handleError(error, res);
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
      return this.handleError(
        {
          code: ShareableErrorCodes.AccountNotFound,
        },
        res
      );
    }

    // Finds and updates the account with the latest follower data and login status
    const updateLoginAction = ({ followers }: { followers: any[] }) => {
      AccountModel.findOneAndUpdate(
        { spotifyUserId },
        { $set: { followers, loggedIn } },
        { new: true },
        (error: Error, account: MongooseDocument) => {
          this.handleError(error, res);
          res.json(account);
        }
      );
    };

    // Resolves latest followers and runs the loginAction
    this.resolveFollowersWithAction(updateLoginAction, req, res);
  }

  public getAllAccountsRequest(req: Request, res: Response) {
    AccountModel.find({}, (error: Error, accounts: MongooseDocument) => {
      this.handleError(error, res);
      res.json(accounts);
    });
  }

  public deleteAccountRequest(req: Request, res: Response) {
    const accountId = req.params.id;

    if (accountId === "all") {
      AccountModel.deleteMany({}, (error: Error) => {
        this.handleError(error, res);
        res.json({ message: "All accounts deleted" });
      });
    } else {
      AccountModel.findByIdAndDelete(
        accountId,
        (error: Error, deleted: any) => {
          this.handleError(error, res);
          const message = deleted
            ? `Account ID ${accountId} deleted successfully`
            : `Account ID ${accountId} not found`;
          res.json({ message });
        }
      );
    }
  }
}
