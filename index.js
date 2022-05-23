import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import MongoDBStore from "connect-mongodb-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url";
import Router from "./Routes/routes.js";
import ClueCardModel from "./models/ClueCardScheema.js"
import moment from 'moment'
const mongodbstore = MongoDBStore(session);
dotenv.config();
const PORT = process.env.PORT || 6237
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
// setting the mongodb connection
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
      // secure: true,
      // sameSite: "none",
      maxAge: 1000 * 60 * 60 * 2, //user will logout in 2 hours
    },
  })
);



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.get("/", async (req, res, next) => {
  const indexPath = path.resolve(__dirname, "./build", "index.html")

  try {
    const todayword = await ClueCardModel.findOne({ date: moment().format("MM/DD/YYYY") });

    if (todayword) {

      const randomNumber = Math.floor(Math.random() * todayword.images.length);
      const cluecardurl = todayword.images[randomNumber].url.split("/").pop();
      fs.readFile(indexPath, "utf8", (err, data) => {
        if (err) {
          console.log(err)
          throw ("page not found")
        }
        data = data.replace("PLACEHOLDER", cluecardurl).replace("PLACEHOLDER", cluecardurl)
        res.send(data)
      })
    } else {
      throw "the images is not found";
    }
  } catch (err) {
    res.send(err);
  }

})
app.use("/", express.static('./build'))
// app.get("/", (req, res) => res.send("hi there"))
app.use("/admin", Router);



app.listen(PORT, () => console.log(`app is running on port ${PORT}`));
