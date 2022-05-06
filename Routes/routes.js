import express from "express";
import AdminController from "../controllers/AdminController.js";
import checkAdmin from "../middleware/checkAdmin.js";
const Router = express.Router();
Router.post("/register", AdminController.addAdmin);
Router.post("/login", AdminController.adminLogin);
Router.get("/retainlogin", checkAdmin, AdminController.retainAdminLogin);
Router.post("/addcluecards", checkAdmin, AdminController.uploadImages);
export default Router;
