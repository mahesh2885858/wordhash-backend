import express from "express";
import AdminController from "./controllers/AdminController.js";
const Router = express.Router();
Router.post("/register", AdminController.addAdmin);
export default Router;
