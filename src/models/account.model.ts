import mongoose from "mongoose";

import jwt from "jsonwebtoken";
import config from "../config";

/**
 * @swagger
 *
 * definitions:
 *   Account:
 *     type: object
 *     required:
 *       - spotifyUserId
 *     properties:
 *       spotifyUserId:
 *         type: string
 *       email:
 *         type: string
 *       loggedIn:
 *         type: boolean
 *       followers:
 *         type: [{ spotifyUserId: String }]
 */
export const AccountSchema = new mongoose.Schema({
  spotifyUserId: {
    type: String,
    unique: true,
    required: true,
  },
  displayName: String,
  imageUrl: String,
  email: String,
  loggedIn: { type: Boolean, default: true },
  followers: {
    type: [{ spotifyUserId: String }],
    default: [],
  },
  externalUrl: String,
  isAdmin: Boolean,
});

AccountSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.accessKey
  ); // get the private key from the config file -> environment variable
  return token;
};

export const AccountModel = mongoose.model("Account", AccountSchema);
