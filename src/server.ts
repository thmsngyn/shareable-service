import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";

const PORT = 4000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
