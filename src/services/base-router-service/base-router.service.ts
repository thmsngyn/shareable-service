import { Response, Request } from "express";
import { Model, MongooseDocument } from "mongoose";

import { ShareableError } from "./base-router.types";
import {
  MongoToShareableErrorCode,
  SpotifyToShareableErrorCode,
  ShareableErrorMessage,
  SpotifyToken,
} from "./base-router.constants";

export class BaseRouterService {
  public documentModel: Model<any>;
  // TODO: Remove temp token (for development)
  public token = SpotifyToken;

  constructor(documentModel: Model<any>) {
    this.documentModel = documentModel;
  }

  public handleError(error: ShareableError, res: Response) {
    let message,
      fromSpotify,
      fromMongo,
      code = undefined;
    let warnings = [];

    if (error) {
      const {
        status = 500,
        message: spotifyErrorMessage, // If message is populated, we know this is a spotify message
        errmsg: mongoErrorMessage, // If errmsg is populated, we know this is a mongo message
        code: overloadedCode, // Overloaded with mongoose codes and app error codes (ShareableErrorCodes)
      } = error;

      // Resolve error code and origin
      if (mongoErrorMessage) {
        fromMongo = true;
        code = MongoToShareableErrorCode[overloadedCode] || undefined;
      } else if (spotifyErrorMessage) {
        fromSpotify = true;
        code = SpotifyToShareableErrorCode[spotifyErrorMessage] || undefined;
      } else {
        // A known error code was passed
        code = overloadedCode;
      }

      if (code) {
        message = ShareableErrorMessage[code];
      } else {
        message =
          mongoErrorMessage || spotifyErrorMessage || "Unknown error occurred";
        warnings.push("Error code not implemented, please handle this error");
      }

      // Clean out warnings if there aren't any
      warnings = warnings.length ? warnings : undefined;
      res
        .status(status)
        .json({ message, code, fromSpotify, fromMongo, warnings });

      // Return so we break the stack
      return;
    }
  }

  public removeDocumentRequest(req: Request, res: Response) {
    const accountId = req.params.id;

    this.documentModel.findByIdAndDelete(
      accountId,
      (error: Error, deleted: any) => {
        this.handleError(error, res);
        const message = deleted
          ? `ID ${accountId} deleted successfully`
          : `ID ${accountId} not found`;
        res.json({ message });
      }
    );
  }

  public getAllDocumentsRequest(req: Request, res: Response) {
    this.documentModel.find({}, (error: Error, accounts: MongooseDocument) => {
      this.handleError(error, res);
      res.json(accounts);
    });
  }
}
