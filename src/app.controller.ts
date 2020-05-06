import { Application } from "express";

import { AccountService } from "./services";
import { AccountRouter } from "./routes";

export class AppController {
  private accountService: AccountService;

  constructor(private app: Application) {
    this.accountService = new AccountService();
    this.routes();
  }

  public routes() {
    // Accounts
    this.app.use("/accounts", AccountRouter);
  }
}
