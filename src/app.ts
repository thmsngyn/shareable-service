import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { AppController } from "./app.controller";

class App {
  public app: Application;
  public appController: AppController;

  constructor() {
    this.app = express();
    this.setConfig();

    // Create and assign controller to app
    this.appController = new AppController(this.app);
  }

  private setConfig() {
    // Allows us to receive requests with data in json format
    this.app.use(bodyParser.json({ limit: "50mb" }));

    // Enables cors
    this.app.use(cors());
  }
}

export default new App().app;
