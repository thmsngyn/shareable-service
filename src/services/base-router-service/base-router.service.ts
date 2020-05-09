import { Response } from "express";

import { ShareableError } from "./base-router.types";
import {
  MongoToShareableErrorCode,
  SpotifyToShareableErrorCode,
  ShareableErrorMessage,
} from "./base-router.constants";

export class BaseRouterService {
  // TODO: Remove temp token (for development)
  public token =
    "BQBzj7naJ6SxfyUcoCBkgKqHJL6ue9lQQfy2JrJ5q_zNf1amGFY2Dao2SOvLCl3xDnyd88hU6VgeSHJoWVlzGk9p1AnXxUjjG-KNpDc7ok2xrCuLko0yZu6FnAHs5FHAPmoFJ3fmGQuyNgKfhvIuWtcfkofgnKDgOrax_zcYUGCKJpZnXgaJ";

  constructor() {}

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
}
