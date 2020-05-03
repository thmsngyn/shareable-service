import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import { AppController } from "./app.controller";
import { DB_URI } from "./constants";

class App {
  public app: Application;
  public appController: AppController;

  constructor() {
    this.app = express();
    this.setAppConfig();
    this.setMongoConfig();

    // Create and assign controller to app
    this.appController = new AppController(this.app);
  }

  private setAppConfig() {
    // Allows us to receive requests with data in json format
    this.app.use(bodyParser.json({ limit: "50mb" }));

    // Enables cors
    this.app.use(cors());
  }

  private setMongoConfig() {
    mongoose.Promise = global.Promise;
    mongoose.connect(DB_URI, {
      useNewUrlParser: true,
    });
  }
}

export default new App().app;
