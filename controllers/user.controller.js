const bcrypt = require("bcrypt");

const { promisify } = require("util");
const { Op } = require("sequelize");
const bcryptHashP = promisify(bcrypt.hash);
const bcryptCompareP = promisify(bcrypt.compare);

const { User, Post, Reply } = require("../models");
const { siteName, makeRandomId, displayDate } = require("../helpers");

const { sendEmail } = require("../email");

const loginForm = (req, res) => {
  if (req.session && req.session.user) {
    res.redirect("/");
    return;
  }
  res.render("login", { title: "Log In" });
};

const signUpForm = (req, res) => {
  if (req.session && req.session.user) {
    res.redirect("/");
    return;
  }
  res.render("signup", { title: "Sign Up" });
};

const forgotPasswordForm = (req, res) => {
  if (req.session && req.session.user) {
    res.redirect("/");
    return;
  }
  res.render("forgot_password", { title: "Forgot Password" });
};

const userProfilePage = async (req, res, next) => {
  try {
    const userInfo = await User.findOne({
      where: {
        username: req.params.username,
      },
      attributes: [
        "id",
        "username",
        "email",
        "avatar",
        "role",
        "createdAt",
        "website",
      ],
    });

    if (!userInfo) {
      const err = {
        message: "User not found!",
        status: 404,
      };
      next(err);
      return;
    }

    let sameUser = false;
    if (req.session.user.id == userInfo.id) {
      sameUser = true;
    }

    const promises = [];

    // post count
    promises.push(
      Post.count({
        where: { createdByUser: userInfo.id },
      }),
    );
    // reply count
    promises.push(
      Reply.count({
        where: { createdByUser: userInfo.id },
      }),
    );

    const [postCount, replyCount] = await Promise.all(promises);

    userInfo.createdAtFormatted = displayDate(userInfo.createdAt);
    userInfo.roleFormatted = userInfo.role;
    if (userInfo.role === "regular") {
      userInfo.roleFormatted = "user";
    }

    res.render("user_profile", {
      title: `${userInfo.username}'s Profile`,
      userInfo,
      postCount,
      replyCount,
      sameUser,
    });
    return;
  } catch (e) {
    next(e);
    console.log(e);
    return;
  }
};

const signupNewUser = async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: {
        username: req.xop.username,
      },
    });

    if (users.length) {
      req.flash("error", ["Username already in use"]);
      res.render("signup", {
        title: "Sign Up",
        body: req.body,
        flashes: req.flash(),
      });
      return;
    }

    // we need to create the account and log the user in
    const passwordHash = await bcryptHashP(req.body.password, 10);

    const user = await User.create({
      username: req.xop.username,
      passwordHash,
      email: req.xop.email,
      role: process.env.FIRST_RUN ? "admin" : "regular",
    });

    // set session
    req.session.user = {
      id: user.id,
      username: user.username,
    };

    res.redirect("/");
    return;
  } catch (e) {
    next(e);
    console.log(e);
    return;
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.xop.username,
      },
    });

    if (!user) {
      req.flash("error", ["User not found"]);
      res.render("login", {
        title: "Log In",
        body: req.body,
        flashes: req.flash(),
      });
      return;
    }

    const passwordsMatch = await bcryptCompareP(
      req.xop.password,
      user.passwordHash,
    );

    if (!passwordsMatch) {
      req.flash("error", ["Invalid Password"]);
      res.render("login", {
        title: "Log In",
        body: req.body,
        flashes: req.flash(),
      });
      return;
    }

    // set session and redirect to /
    req.session.user = {
      id: user.id,
      username: user.username,
    };

    res.redirect("/");
    return;
  } catch (e) {
    next(e);
    console.log(e);
    return;
  }
};

const logoutUser = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect("/");
  });
};

const sendForgotPasswordMail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.xop.email,
      },
      attributes: ["id", "email", "username", "resetPasswordToken"],
    });

    if (!user) {
      req.flash("error", ["Email not registered"]);
      res.render("forgot_password", {
        title: "Forgot Password",
        body: req.body,
        flashes: req.flash(),
      });
      return;
    }

    const resetToken = makeRandomId(8);
    user.resetPasswordToken = resetToken;
    await user.save();

    const resetURL = `http://${req.headers.host}/reset-password?token=${resetToken}&email=${user.email}`;

    let html = `<p>To reset your password, click <a href="${resetURL}">here</a></p>`;
    html += `<p>Best,<br/>The ${siteName} admin</p>`;

    let text = `Visit ${resetURL} to reset your password.`;
    text += `Best, \r\nThe ${siteName} admin`;

    const msg = {
      to: user.email,
      subject: `Reset password instructions: ${siteName}`,
      text,
      html,
    };

    await sendEmail(msg);
    req.flash("success", ["Check email for reset instructions"]);
    res.render("forgot_password", {
      title: "Forgot Password",
      body: req.body,
      flashes: req.flash(),
    });
    return;
  } catch (e) {
    next(e);
    console.log(e);
    return;
  }
};

const getResetPasswordForm = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.xop.email,
        resetPasswordToken: req.xop.token,
      },
      attributes: ["id", "resetPasswordToken", "email", "username"],
    });

    if (!user) {
      req.flash("error", ["Email or reset token not valid"]);
      res.render("forgot_password", {
        title: "Forgot Password",
        body: { email: req.xop.email },
        flashes: req.flash(),
      });
      return;
    }

    const pageData = {
      username: user.username,
      email: req.xop.email,
      token: req.xop.token,
    };

    req.flash("success", [`Hi, ${user.username}!`]);
    res.render("reset_password", {
      title: "Reset Password",
      body: pageData,
      flashes: req.flash(),
    });
    return;
  } catch (e) {
    next(e);
    console.log(e);
    return;
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.xop.email,
        resetPasswordToken: req.xop.token,
      },
      attributes: ["id", "passwordHash", "resetPasswordToken"],
    });

    if (!user) {
      req.flash("error", [`Email or reset token not found`]);
      res.render("reset_password", {
        title: "Reset Password",
        body: req.body,
        flashes: req.flash(),
      });
      return;
    }

    const passwordHash = await bcryptHashP(req.body.password, 10);
    user.passwordHash = passwordHash;
    user.resetPasswordToken = "";
    await user.save();

    req.flash("success", ["Password updated"]);
    res.render("login", { title: "Log In", flashes: req.flash() });
    return;
  } catch (e) {
    next(e);
    console.log(e);
    return;
  }
};

module.exports = {
  loginForm,
  signUpForm,
  forgotPasswordForm,
  userProfilePage,

  signupNewUser,
  loginUser,
  logoutUser,
  sendForgotPasswordMail,
  getResetPasswordForm,
  resetPassword,
};
