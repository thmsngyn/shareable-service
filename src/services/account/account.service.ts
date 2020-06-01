import { Request, Response } from "express";
import { MongooseDocument } from "mongoose";

import { ShareableErrorCodes } from "../base-router-service/base-router.constants";
import { BaseRouterService } from "../base-router-service";
import { SpotifyService } from "../spotify/spotify.service";
import { AccountModel } from "../../models";

export class AccountService extends BaseRouterService {
  constructor() {
    super(AccountModel);
  }

  private sendResponseWithHeaders(account, res) {
    const token = account.schema.methods.generateAuthToken();
    res.header("X-Auth-Token", token).send(account);
  }

  private buildFollowers(followings: boolean[], allAccounts: any[]) {
    return followings
      .map((isFollowing: boolean, index: number) => {
        if (isFollowing) {
          const { _id, spotifyUserId } = allAccounts[index];
          return { _id, spotifyUserId };
        }
      })
      .filter(Boolean); // Filter out undefined
  }

  /**
   * Resolves latest followers for the current user and dispatches an action (given the followers)
   * @param action Action to dispatch, receives an object as a param with followers as a field
   * @param req Request
   * @param res Response
   */
  private resolveFollowersWithAction(
    action: Function,
    req: Request,
    res: Response
  ) {
    const { spotifyUserId } = req.body;
    const token = req.spotifyToken;

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
              const followers = this.buildFollowers(followings, allAccounts);
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

        this.sendResponseWithHeaders(newAccount, res);
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

          this.sendResponseWithHeaders(account, res);
        }
      );
    };

    // Resolves latest followers and runs the loginAction
    this.resolveFollowersWithAction(updateLoginAction, req, res);
  }
}
