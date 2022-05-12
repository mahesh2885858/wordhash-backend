import AdminModel from "../models/AdminScheema.js";
import ClueCardModel from "../models/ClueCardScheema.js";
import fs from 'fs'
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
      return { url: file.path };
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
  getTodaysWord: async (req, res) => {
    try {
      const todayword = await ClueCardModel.findOne({ date: req.body.today });
      if (todayword) {
        res.send(todayword);
      } else {
        throw "the images is not found";
      }
    } catch (err) {
      res.send(err);
    }
  },
  removeImage: async (req, res) => {
    try {

      const deleteone = await ClueCardModel.findByIdAndUpdate(
        req.body.entryId,

        {
          $pull: { images: { _id: req.body.imageId } },
        },
        { new: true },
        (err, doc, res1) => {
          if (err) {
            console.log(err)
          } else {
            fs.unlink(req.body.url, (err) => {
              return
            })
          }
        }
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
  updateEntry: async (req, res) => {
    // console.log(req.body);
    // console.log(req.files);
    const word = req.body.word;
    const date = req.body.date;
    const reqfiles = req.files?.map((file) => {
      return { url: file.path };
    });
    try {
      const data = await ClueCardModel.findByIdAndUpdate(
        req.body.entryId,
        { word: word, $push: { images: reqfiles } },
        { new: true }
      );

      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getImageById: async (req, res) => {
    try {
      const data = await ClueCardModel.findById(req.body.entryId, {
        images: 1,
        _id: 0,
      });
      res.send(data);
    } catch (err) {
      res.send(err);
    }
  },
  deleteEntry: async (req, res) => {
    try {
      const data = await ClueCardModel.findByIdAndDelete(req.body.entryId);
      res.status(200).send(data);
    } catch (err) {
      res.status(400).send(err);
    }
  },
  logout: async (req, res) => {
    try {
      req.session.destroy((err) => {
        res.send("logout");
      });
    } catch (error) {
      res.send(error);
    }
  },
};
export default AdminController;
