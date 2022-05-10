import AdminModel from "../models/AdminScheema.js";
import ClueCardModel from "../models/ClueCardScheema.js";
import fs from "fs";
const AdminController = {
  addAdmin: async (req, res) => {
    try {
      const { name, username, email, password } = req.body;

      const admin = new AdminModel({ name, username, email, password });
      const result = await admin.save();
      res.send(result);
    } catch (err) {
      res.send(err);
    }
  },
  adminLogin: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (username && password) {
        const user = await AdminModel.findOne({ username });
        if (user) {
          if (user.password === password) {
            req.session.adminId = user._id;
            res.send(user);
          } else {
            throw "password is wrong";
          }
        } else {
          throw "user doen't exist";
        }
      } else {
        throw "need username and password";
      }
    } catch (err) {
      res.status(400).send(err);
    }
  },
  retainAdminLogin: async (req, res) => {
    try {
      const id = req.id;
      if (id) {
        const user = await AdminModel.findById(id);
        res.send(user);
      } else {
        throw "please login again";
      }
    } catch (error) {
      res.send(error);
    }
  },
  uploadImages: async (req, res) => {
    const reqName = req.files?.map((file) => {
      const buffer = fs.readFileSync(file.path);
      const base64 = buffer.toString("base64");
      return { image: buffer };
    });
    try {
      const newClueCard = new ClueCardModel({
        word: req.body.word,
        date: req.body.date,
        images: reqName,
      });
      const data = await newClueCard.save();
      res.send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getImages: async (req, res) => {
    try {
      const imagedata = await ClueCardModel.findById(
        "6276127f24351b833bcbd803"
      );
      if (imagedata) {
        res.send(imagedata);
      } else {
        throw "the images is not found";
      }
    } catch (err) {
      res.send(err);
    }
  },
  updateEntry: async (req, res) => {
    console.log(req.body);
    try {
      const deleteone = await ClueCardModel.findByIdAndUpdate(
        req.body.entryId,

        {
          $pull: { images: { _id: req.body.imageId } },
        },
        { new: true }
      );
      res.send(deleteone);
    } catch (error) {
      res.send(error);
    }
  },
  getAllWords: async (req, res) => {
    try {
      const data = await ClueCardModel.find({});
      if (data) {
        res.status(200).send(data);
      } else {
        throw "the data is not found";
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },
};
export default AdminController;
