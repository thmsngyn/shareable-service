import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import mongoose from "mongoose";

import * as swaggerDocument from "../swagger.json";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import { AppRouter } from "./app.router";
import config from "./config";

// Swagger jsdoc allows us to markup routes with jsdoc comments
const swaggerSpec = swaggerJSDoc(swaggerDocument);

class App {
  public app: Application;
  public appRouter: AppRouter;

  constructor() {
    this.app = express();
    this.setAppConfig();
    this.setMongoConfig();

    // Create and assign controller to app
    this.appRouter = new AppRouter(this.app);
  }

  private setAppConfig() {
    // Allows us to receive requests with data in json format
    this.app.use(bodyParser.json({ limit: "50mb" }));

    // Enables cors
    this.app.use(
      cors({
        exposedHeaders: ["X-Auth-Token"],
      })
    );

    // Use Swagger
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private setMongoConfig() {
    // Below removes deprecation warnings
    const deprecationWarningConfigs = {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };

    mongoose.Promise = global.Promise;
    // The MONGODB_URI env var is set by heroku in production
    mongoose.connect(config.dbUri, {
      useNewUrlParser: true,
      ...deprecationWarningConfigs,
    });
  }
}

export default new App().app;
