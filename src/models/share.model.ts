import mongoose, { Schema } from "mongoose";

/**
 * @swagger
 *
 * definitions:
 *   Share:
 *     type: object
 *     required:
 *       - accountId
 *       - trackId
 *     properties:
 *       accountId:
 *         type: string
 *       trackId:
 *         type: string
 */
export const ShareSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
  },
  trackId: {
    type: String,
    required: true,
  },
});

// Make a compound index on accountId and trackId
ShareSchema.index({ accountId: 1, trackId: 1 }, { unique: true });

export const ShareModel = mongoose.model("Stream", ShareSchema);
