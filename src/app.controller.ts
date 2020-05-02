import { Application } from "express";

import { AccountService } from "./services";

export class AppController {
  private accountService: AccountService;

  constructor(private app: Application) {
    this.accountService = new AccountService();
    this.routes();
  }

  public routes() {
    this.app.route("/").get(this.accountService.welcomeMessage);
  }
}
