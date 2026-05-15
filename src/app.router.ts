import { Application, Request, Response } from "express";

import mongoose from "mongoose";

import { AccountRouter, StreamRouter, SpotifyProxyRouter } from "./routes";

export class AppRouter {
  constructor(private app: Application) {
    this.routes();
  }

  public routes() {
    this.app.get("/health", async (_req: Request, res: Response) => {
      try {
        await mongoose.connection.db.admin().ping();
        res.status(200).send({ status: "ok" });
      } catch (err) {
        res.status(503).send({ status: "error", message: "db unreachable" });
      }
    });

    this.app.use("/accounts", AccountRouter);
    this.app.use("/stream", StreamRouter);
    this.app.use("/spotify-proxy", SpotifyProxyRouter);
  }
}
