import { Application } from "express";

import { AccountRouter, StreamRouter } from "./routes";

export class AppRouter {
  constructor(private app: Application) {
    this.routes();
  }

  public routes() {
    this.app.use("/accounts", AccountRouter);
    this.app.use("/stream", StreamRouter);
  }
}
