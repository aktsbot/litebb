const { User } = require("../models");

const isSessionActive = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    let redirectUrl = "/login";
    redirectUrl += `?next=${encodeURIComponent(req.path)}`;
    return res.redirect(redirectUrl);
  }
};

const addUserMeta = async (req, res, next) => {
  if (req.session && req.session.user) {
    const user_meta = await User.findOne({
      where: {
        id: req.session.user.id,
      },
      attributes: ["role", "username", "email", "id", "avatar"],
    });

    if (user_meta) {
      req.session.user.meta = user_meta;
    }
  }

  next();
};

const isAdmin = (req, res, next) => {
  if (req.session.user.meta && req.session.user.meta.role === "admin") {
    next();
  } else {
    return res.redirect("/");
  }
};

module.exports = {
  isSessionActive,
  addUserMeta,
  isAdmin,
};
