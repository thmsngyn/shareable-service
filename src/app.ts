import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import mongoose from "mongoose";

import * as swaggerDocument from "../swagger.json";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import { AppController } from "./app.controller";
import { DB_URI } from "./constants";

// Swagger jsdoc allows us to markup routes with jsdoc comments
const swaggerSpec = swaggerJSDoc(swaggerDocument);

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

    // Use Swagger
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private setMongoConfig() {
    mongoose.Promise = global.Promise;
    mongoose.connect(DB_URI, {
      useNewUrlParser: true,
    });
  }
}

export default new App().app;
