import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { dbConnection } from "./database/dbConnection.js";
import morgan from "morgan";
import { init } from "./src/modules/index.routes.js";
import cors from 'cors'
const app = express();
const port = process.env.PORT || 3000;
app.use(cors())
app.use(express.json());
if (process.env.MODE == "development") {
  app.use(morgan("dev"));
}
init(app)
app.get("/", (req, res) => {
  res.send("Hello world");
});

//Global error handling middleware

dbConnection();

app.listen(port, () => {
  console.log("Connected successfully");
});

process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection", err);
});
