import express from "express";
import multer from "multer";
import AdminController from "../controllers/AdminController.js";

import checkAdmin from "../middleware/checkAdmin.js";
// multer setup
export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("first step")
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const upload = multer({ storage: storage });
const Router = express.Router();

Router.post("/register", AdminController.addAdmin);
Router.post("/login", AdminController.adminLogin);
Router.get("/retainlogin", checkAdmin, AdminController.retainAdminLogin);
Router.post(
  "/addcluecards",
  upload.array("clue-card", 4),
  AdminController.uploadImages
);
Router.get("/getimages", AdminController.getImages);
Router.put("/removeimage", AdminController.removeImage);
Router.put("/updateentry", upload.array("clue-card", 4), AdminController.updateEntry);
Router.get("/getallwords", AdminController.getAllWords);
export default Router;
