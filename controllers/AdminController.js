import AdminModel from "../models/AdminScheema.js";
import ClueCardModel from "../models/ClueCardScheema.js";
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
      res.send(err);
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
    try {
      const { word, date, imageurl } = req.body;
      const newClueCard = new ClueCardModel({ word, date, imageurl });
      const data = await newClueCard.save();
      res.send(data);
    } catch (error) {
      res.send(error);
    }
  },
};
export default AdminController;
