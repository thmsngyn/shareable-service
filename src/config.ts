const DB_HOSTNAME = "localhost";
const DB_PORT = "27017";
const DB_NAME = "ShareableDB";
const LOCAL_DB_URI = `mongodb://${DB_HOSTNAME}:${DB_PORT}/${DB_NAME}`;

interface AppConfig {
  appPort: string;
  dbUri: string;
}

const dev: Partial<AppConfig> = {
  appPort: "4000",
  dbUri: LOCAL_DB_URI,
};

const prod: Partial<AppConfig> = {
  appPort: process.env.PORT,
  dbUri: process.env.MONGODB_URI,
};

const envConfig: Partial<AppConfig> =
  process.env.NODE_ENV === "production" ? prod : dev;

export default {
  // Common configs

  // Environment configs
  ...envConfig,
} as AppConfig;
