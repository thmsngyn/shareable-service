import { Application } from "express";

import { AccountRouter } from "./routes";

export class AppRouter {
  constructor(private app: Application) {
    this.routes();
  }

  public routes() {
    // Accounts
    this.app.use("/accounts", AccountRouter);
  }
}
