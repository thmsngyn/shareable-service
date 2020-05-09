export enum ShareableErrorCodes {
  AccountNotFound = 1000,
  AccountAlreadyExists = 1001,
  InvalidAccessSpotifyAccessToken = 1002,
  SpotifyAccessTokenExpired = 1003,
}

export const ShareableErrorMessage: Record<ShareableErrorCodes, string> = {
  [ShareableErrorCodes.AccountNotFound]: "Account doesn't exist",
  [ShareableErrorCodes.AccountAlreadyExists]: "Account already exists",
  [ShareableErrorCodes.InvalidAccessSpotifyAccessToken]:
    "Invalid Spotify access token",
  [ShareableErrorCodes.SpotifyAccessTokenExpired]:
    "Spotify access token expired",
};

// Maps Mongo error codes to known Shareable error codes
export const MongoToShareableErrorCode: Record<number, ShareableErrorCodes> = {
  11000: ShareableErrorCodes.AccountAlreadyExists,
};

// Maps Spotify error messages to known Shareable error codes
export const SpotifyToShareableErrorCode: Record<
  string,
  ShareableErrorCodes
> = {
  "Invalid access token": ShareableErrorCodes.InvalidAccessSpotifyAccessToken,
  "The access token expired": ShareableErrorCodes.SpotifyAccessTokenExpired,
};
