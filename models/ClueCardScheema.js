import mongoose from "mongoose";
import { reqString } from "./AdminScheema.js";
const imageScheema = new mongoose.Schema({
  image: {
    type: Buffer,
    contentType: String,
  },
});
const ClueCardScheema = new mongoose.Schema({
  word: reqString,
  date: reqString,
  images: [imageScheema],
});
const ClueCardModel = mongoose.model("cluecard", ClueCardScheema);
export default ClueCardModel;
