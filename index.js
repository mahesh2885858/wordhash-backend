import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import MongoDBStore from "connect-mongodb-session";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import Router from "./routes.js";
const mongodbstore = MongoDBStore(session);
dotenv.config();
const app = express();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("its connected mongo"))
  .catch((err) => console.log(err));
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser);
app.use(bodyparser.urlencoded({ extended: true }));
const store = new mongodbstore({
  uri: process.env.MONGO_URL,
  collection: "adminSessions",
});
app.use(
  session({
    secret: "somethingverysecret",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2, //user will logout in 2 hours
    },
  })
);
// app.use("/admin", Router);

app.get("/", (req, res) => {
  res.send("hoo");
});
app.listen(8080, () => console.log("app is running on port 8080"));
// app.listen()
