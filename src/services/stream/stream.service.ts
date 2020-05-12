import { Request, Response } from "express";
import { MongooseDocument, Types } from "mongoose";

import { BaseRouterService } from "./../base-router-service";
import { ShareModel, AccountModel } from "../../models";

export class StreamService extends BaseRouterService {
  constructor() {
    super();
  }

  public getStreamRequest(req: Request, res: Response) {
    const { accountId } = req.params;

    if (accountId === "all") {
      super.getAllDocumentsRequest(req, res, ShareModel);
      return;
    } else {
      AccountModel.findById(accountId, (error: Error, account: any) => {
        this.handleError(error, res);

        const followerAccountIds = account.followers.map((follower: any) =>
          Types.ObjectId(follower._id)
        );
        ShareModel.find(
          {
            accountId: {
              $in: followerAccountIds,
            },
          },
          (error: Error, stream: MongooseDocument) => {
            this.handleError(error, res);
            res.json(stream);
          }
        );
      });
    }
  }

  public addShareRequest(req: Request, res: Response) {
    const { body: shareToAdd } = req;

    const newShare = new ShareModel(shareToAdd);

    newShare.save((error: Error, share: MongooseDocument) => {
      this.handleError(error, res);
      res.json(share);
    });
  }

  public removeShareRequest(req: Request, res: Response) {
    super.removeDocumentRequest(req, res, ShareModel);
  }
}
