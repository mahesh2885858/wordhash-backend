import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import MongoDBStore from "connect-mongodb-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import Router from "./Routes/routes.js";
const mongodbstore = MongoDBStore(session);
dotenv.config();
const PORT = process.env.PORT || 8000
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("its connected mongo"))
  .catch((err) => console.log(err));


app.use(cors())

// app.use(
//   cors({
//     credentials: true,
//     origin: "http://localhost:3000",
//   })
// );

app.use(express.static("uploads"));
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
app.use("/admin", Router);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(""))
}

app.listen(PORT, () => console.log(`app is running on port ${PORT}`));
