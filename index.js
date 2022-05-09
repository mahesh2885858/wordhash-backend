import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import MongoDBStore from "connect-mongodb-session";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import multer from "multer";
import Router from "./Routes/routes.js";
import AdminController from "./controllers/AdminController.js";
const mongodbstore = MongoDBStore(session);
dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("its connected mongo"))
  .catch((err) => console.log(err));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(cookieParser());
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
// multer setup
// app.post("/upload", upload.single("clue-card"), AdminController.uploadImages);
app.use("/admin", Router);

app.get("/", (req, res) => {
  res.send("hlo");
});
app.listen(8000, () => console.log("app is running on port 8000"));
