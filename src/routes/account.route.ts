import express from "express";

import { AccountService } from "./../services/account.service";

const accountService = new AccountService();
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
Router.get("/", accountService.getAllAccountsRequest.bind(accountService));

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
Router.post("/", accountService.addAccountRequest.bind(accountService));
Router.delete("/:id", accountService.deleteAccountRequest.bind(accountService));

Router.post("/login", accountService.loginRequest.bind(accountService));

export default Router;
