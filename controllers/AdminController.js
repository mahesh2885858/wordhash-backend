import AdminModel from "../Scheema/Scheema.js";
const AdminController = {
  addAdmin: async (req, res) => {
    console.log("first");
    res.send("hi there");
    // try {
    //   const { name, username, email, password } = req.body;

    //   const admin = new AdminModel({ name, username, email, password });
    //   const result = await admin.save();
    //   res.send(result);
    // } catch (err) {
    //   res.send(err);
    // }
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
};
export default AdminController;
