import { SpotifyService } from "./../spotify/spotify.service";
import { Request, Response } from "express";
import { MongooseDocument, Types } from "mongoose";

import { BaseRouterService } from "./../base-router-service";
import { ShareModel, AccountModel } from "../../models";

import { StreamTypes } from "./stream.types";

export class StreamService extends BaseRouterService {
  constructor() {
    super(ShareModel);
  }

  public async getStreamRequest(req: Request, res: Response) {
    const { accountId } = req.params;
    const { type = StreamTypes.Followers } = req.query;
    const token = req.spotifyToken;

    if (type === StreamTypes.Followers) {
      AccountModel.findById(accountId, (error: Error, account: any) => {
        this.handleError(error, res);

        const followerAccountIds = account.followers.map((follower: any) =>
          Types.ObjectId(follower._id)
        );

        if (!followerAccountIds.length) {
          return res.json([]);
        }
        ShareModel.find({
          accountId: {
            $in: followerAccountIds,
          },
        })
          .sort({ createdAt: "desc" })
          .exec(async (error: Error, stream: any) => {
            this.handleError(error, res);
            const trackIds = (stream && stream.map((s) => s.trackId)) || [];
            const { tracks = [] } =
              (trackIds.length &&
                (await SpotifyService.getTracks(token, trackIds))) ||
              {};
            const shares = await Promise.all(
              tracks.map(async (track, index) => {
                const account = await AccountModel.findById(
                  stream[index].accountId
                ).exec();

                return { track, account, metadata: stream[index] };
              })
            );
            res.json({ shares });
          });
      });
    } else {
      ShareModel.find({
        accountId,
      })
        .sort({ createdAt: "desc" })
        .exec(async (error: Error, stream: any) => {
          this.handleError(error, res);
          const trackIds = stream.length && stream.map((s) => s.trackId);
          const { tracks = [] } =
            (trackIds.length &&
              (await SpotifyService.getTracks(token, trackIds))) ||
            {};
          const shares = tracks.map((track, index) => {
            return { track, metadata: stream[index] };
          });
          res.json({ shares });
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
}
