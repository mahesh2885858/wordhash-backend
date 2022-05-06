const checkAdmin = (req, res, next) => {
  const adminId = req.session.adminId;
  if (adminId) {
    req.id = adminId;
  } else {
    return;
  }
  next();
};
export default checkAdmin;
