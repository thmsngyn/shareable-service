import express from "express";

import { StreamService } from "../services";

const service = new StreamService();
const Router = express.Router();

/**
 * @swagger
 *
 * /stream:
 *   get:
 *     description: Get the current user's share stream
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: List of shares
 *         schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Share'
 */
Router.get("/:accountId", service.getStreamRequest.bind(service));

/**
 * @swagger
 *
 * /stream/share:
 *   post:
 *     description: Add a share
 *     produces:
 *       - application/json
 *     parameters:
 *       - description: Share object
 *         in:  body
 *         required: true
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Share'
 *     responses:
 *       200:
 *         description: Share object
 *         schema:
 *           $ref: '#/definitions/Share'
 */
Router.post("/share", service.addShareRequest.bind(service));

/**
 * @swagger
 *
 * /stream/share:
 *   delete:
 *     description: Delete a share
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: Message object
 */
Router.delete("/share/:id", service.removeDocumentRequest.bind(service));

export default Router;
