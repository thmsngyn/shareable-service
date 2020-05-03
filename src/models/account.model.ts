import mongoose from "mongoose";

/**
 * @swagger
 *
 * definitions:
 *   Account:
 *     type: object
 *     required:
 *       - email
 *     properties:
 *       email:
 *         type: string
 *       loggedIn:
 *         type: boolean
 */
const AccountSchema = new mongoose.Schema({
  email: String,
  loggedIn: Boolean,
});

export const AccountModel = mongoose.model("Account", AccountSchema);
