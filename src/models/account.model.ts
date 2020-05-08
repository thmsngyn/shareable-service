import mongoose from "mongoose";

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
});

export const AccountModel = mongoose.model("Account", AccountSchema);
