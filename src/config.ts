const DB_HOSTNAME = "localhost";
const DB_PORT = "27017";
const DB_NAME = "ShareableDB";
const LOCAL_DB_URI = `mongodb://${DB_HOSTNAME}:${DB_PORT}/${DB_NAME}`;
const LOCAL_ACCESS_KEY = "local-access-key";

interface AppConfig {
  appPort: string;
  dbUri: string;
  accessKey: string;
}

const dev: Partial<AppConfig> = {
  appPort: "4000",
  dbUri: LOCAL_DB_URI,
  accessKey: LOCAL_ACCESS_KEY,
};

const prod: Partial<AppConfig> = {
  appPort: process.env.PORT,
  dbUri: process.env.MONGODB_URI,
  accessKey: process.env.ACCESS_KEY,
};

const envConfig: Partial<AppConfig> =
  process.env.NODE_ENV === "production" ? prod : dev;

export default {
  // Common configs

  // Environment configs
  ...envConfig,
} as AppConfig;
