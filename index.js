import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import MongoDBStore from "connect-mongodb-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Router from "./Routes/routes.js";
import ClueCardModel from "./models/ClueCardScheema.js";
import moment from "moment";
const mongodbstore = MongoDBStore(session);
dotenv.config();
const PORT = process.env.PORT || 6237;
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
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://192.168.29.17:3000",
    ],
    // origin: "*"
  })
);
//coonect
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
      maxAge: 1000 * 60 * 60 * 2, //admin will logout in 2 hours
    },
  })
);

// const dummyRoot = express.Router()
// dummyRoot.get("/*", async (req, res, next) => {

//   const todayword = await ClueCardModel.findOne({ date: moment().format("MM/DD/YYYY") });

//   if (todayword) {

//     const randomNumber = Math.floor(Math.random() * todayword.images.length);

//     if (todayword.images.length > 0) {

//       const cluecardurl = todayword.images[randomNumber].url.split("/").pop();
//       res.send(`

//       <!doctype html>
//     <html lang="en">

//     <head>
//         <meta charset="utf-8" />
//         <meta name="viewport" content="width=device-width,initial-scale=1" />
//         <meta name="theme-color" content="#000000" />
//         <meta named="escription" content="Web site created using create-react-app" />
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:site" content="@Wordhash" />
//         <meta name="twitter:creator" content="@wordhash" />
//         <meta name="twitter:title" content="WORDHASH " />
//         <meta name="twitter:description" content="Somedescription" />
//         <meta name="twitter:image" content="https://mb2212.vanillanetworks.co.in/${cluecardurl}" />
//         <meta property="og:title" content="WORDHASH" />
//         <meta property="og:updated_time" content="TIMESTAMPS" />
//         <meta property="og:image" content="https://mb2212.vanillanetworks.co.in/${cluecardurl}" />
//         <link rel=" icon" href="/wordhash-icon-64x64.png" />
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
//         <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />
//         <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Nunito:wght@800&display=swap"
//             rel="stylesheet">
//         <link rel="apple-touch-icon" href="/wordhash-icon-192x192.png" />
//         <link rel="manifest" href="/manifest.json" />
//         <title>Word Hash</title>
//         <script defer="defer" src="/static/js/main.7b3005af.js"></script>
//         <link href="/static/css/main.1cc7d3e7.css" rel="stylesheet">
//     </head>

//     <body><noscript>You need to enable JavaScript to run this app.</noscript>
//         <div id="root"></div>
//     </body>

//     </html>

//       `)
//     }
//   } else {
//     res.send("no word today")
//   }
// })

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get("/", async (req, res, next) => {
  console.log(req.headers["user-agent"]);
  const indexPath = path.resolve(__dirname, "./build", "index.html");

  try {
    const todayword = await ClueCardModel.findOne({
      date: moment().format("MM/DD/YYYY"),
    });

    if (todayword) {
      const randomNumber = Math.floor(Math.random() * todayword.images.length);

      fs.readFile(indexPath, "utf8", (err, data) => {
        if (todayword.images.length > 0) {
          if (err) {
            console.log(err);
            throw "page not found";
          }
          const cluecardurl = todayword.images[randomNumber].url
            .split("/")
            .pop();
          if (cluecardurl) {
            const timestamps = new Date().getTime();
            data = data
              .replace("PLACEHOLDER", cluecardurl)
              .replace("PLACEHOLDER", cluecardurl)
              .replace("TIMESTAMPS", timestamps);
            res.send(data);
          } else {
            res.send(data);
          }
        } else {
          res.send(data);
        }
      });
    } else {
      fs.readFile(indexPath, "utf8", (err, data) => {
        if (err) {
          console.log(err);
          throw "page  not found";
        } else {
          res.send(data);
        }
      });
      // throw "the images is not found";
    }
  } catch (err) {
    res.send(err);
  }
});
app.use("/", express.static("./build"));
// app.get("/", (req, res) => res.send("hi there"))
// app.use("/deepend", dummyRoot)
app.use("/admin", Router);
    
app.listen(PORT, () => console.log(`app is running on port ${PORT}`));
