import mongoose from "mongoose";
import { reqString } from "./AdminScheema.js";
const imageScheema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
});
const ClueCardScheema = new mongoose.Schema({
  word: reqString,
  date: reqString,
  imageurl: [imageScheema],
});
const ClueCardModel = mongoose.model("cluecard", ClueCardScheema);
export default ClueCardModel;
