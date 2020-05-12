export enum ShareableErrorCodes {
  AccountNotFound = 1000,
  EntityAlreadyExists = 1001,
  InvalidAccessSpotifyAccessToken = 1002,
  SpotifyAccessTokenExpired = 1003,
}

export const ShareableErrorMessage: Record<ShareableErrorCodes, string> = {
  [ShareableErrorCodes.AccountNotFound]: "Account doesn't exist",
  [ShareableErrorCodes.EntityAlreadyExists]: "Entity already exists",
  [ShareableErrorCodes.InvalidAccessSpotifyAccessToken]:
    "Invalid Spotify access token",
  [ShareableErrorCodes.SpotifyAccessTokenExpired]:
    "Spotify access token expired",
};

// Maps Mongo error codes to known Shareable error codes
export const MongoToShareableErrorCode: Record<number, ShareableErrorCodes> = {
  11000: ShareableErrorCodes.EntityAlreadyExists,
};

// Maps Spotify error messages to known Shareable error codes
export const SpotifyToShareableErrorCode: Record<
  string,
  ShareableErrorCodes
> = {
  "Invalid access token": ShareableErrorCodes.InvalidAccessSpotifyAccessToken,
  "The access token expired": ShareableErrorCodes.SpotifyAccessTokenExpired,
};

export const SpotifyToken =
  "BQD-HufFGaxE_h-E1rDzhAAPOie8DoEDD95N8b4VmLfbzjmJjnM4f1FWhVji9ttWedFtWQDUp-a2lsdY3hE7fvwcW6_E57buK8oSx-eLZrp4SWFK2oqLYcCQz0FvO0Rn62cmGkGWg-jJLX-tNtI8y1UMc4rlQY6jkgESIB5A8eWf3DStJpwL";
