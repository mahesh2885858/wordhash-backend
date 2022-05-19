const checkAdmin = (req, res, next) => {
  const adminId = req.session.adminId;
  if (adminId) {
    req.id = adminId;
  } else {
    res.status(400).send("no id")
    return;
  }
  next();
};
export default checkAdmin;
