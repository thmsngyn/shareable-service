import app from "./app";
import config from "./config";

// The PORT env var is set by heroku in production
app.listen(config.appPort, () =>
  console.log(`Listening on port ${config.appPort}`)
);
