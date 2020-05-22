import app from "./app";
import { LOCAL_PORT } from "./constants/server.constants";

// The PORT env var is set by heroku in production
app.listen(process.env.PORT || LOCAL_PORT, () =>
  console.log(`Listening on port ${process.env.PORT || LOCAL_PORT}`)
);
