import express from "express";

import { AccountService } from "../services";
import { handleSpotifyToken, auth } from "../middleware/auth";

const service = new AccountService();
const Router = express.Router();

/**
 * @swagger
 *
 * /accounts:
 *   get:
 *     description: Get all accounts
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: List of accounts
 *         schema:
 *          type: array
 *          items:
 *            $ref: '#/definitions/Account'
 */
Router.get("/", auth, service.getAllDocumentsRequest.bind(service));

/**
 * @swagger
 *
 * /accounts:
 *   post:
 *     description: Add an account
 *     produces:
 *       - application/json
 *     parameters:
 *       - description: Account object
 *         in:  body
 *         required: true
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Account'
 *     responses:
 *       200:
 *         description: Account object
 *         schema:
 *           $ref: '#/definitions/Account'
 */
Router.post("/", handleSpotifyToken, service.addAccountRequest.bind(service));

/**
 * @swagger
 *
 * /accounts:
 *   delete:
 *     description: Delete an account
 *     produces:
 *       - application/json
 *     parameters:
 *     responses:
 *       200:
 *         description: Message object
 *         type: string
 */
Router.delete("/:id", auth, service.removeDocumentRequest.bind(service));

/**
 * @swagger
 *
 * /accounts/login:
 *   post:
 *     description: Update an account's login status
 *     produces:
 *       - application/json
 *     parameters:
 *       - description: Account object
 *         in:  body
 *         required: true
 *         type: object
 *         schema:
 *           $ref: '#/definitions/Account'
 *     responses:
 *       200:
 *         description: Account object
 *         schema:
 *           $ref: '#/definitions/Account'
 */
Router.post("/login", handleSpotifyToken, service.loginRequest.bind(service));

export default Router;
