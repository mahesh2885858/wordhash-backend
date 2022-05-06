import mongoose from "mongoose";
export const reqString = { type: String, required: true };
const AdminScheema = new mongoose.Schema({
  username: reqString,
  password: reqString,
  name: reqString,
  email: reqString,
});
const AdminModel = mongoose.model("admin", AdminScheema);
export default AdminModel;
