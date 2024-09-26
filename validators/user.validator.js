const joi = require("joi");

const signUpNewUser = (req, res, next) => {
  const schema = joi.object({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(20).required(),
    password_confirm: joi
      .string()
      .min(8)
      .max(20)
      .required()
      .valid(joi.ref("password")),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    // console.log(error.details)
    req.flash(
      "error",
      error.details.map((err) => err.message),
    );
    res.render("signup", {
      title: "Sign Up",
      body: req.body,
      flashes: req.flash(),
    });
    return;
  } else {
    req.xop = {
      username: value.username,
      password: value.password,
      email: value.email,
    };
    next();
  }
};

const loginUser = (req, res, next) => {
  const schema = joi.object({
    username: joi.string().required(),
    password: joi.string().min(8).max(20).required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    // console.log(error.details)
    req.flash(
      "error",
      error.details.map((err) => err.message),
    );
    res.render("login", {
      title: "Log In",
      body: req.body,
      flashes: req.flash(),
    });
    return;
  } else {
    req.xop = {
      username: value.username,
      password: value.password,
    };
    next();
  }
};

const sendForgotPasswordMail = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    // console.log(error.details)
    req.flash(
      "error",
      error.details.map((err) => err.message),
    );
    res.render("forgot_password", {
      title: "Forgot Password",
      body: req.body,
      flashes: req.flash(),
    });
    return;
  } else {
    req.xop = {
      email: value.email,
    };
    next();
  }
};

const getResetPasswordForm = (req, res, next) => {
  const schema = joi.object({
    token: joi.string().min(8).max(8).required(),
    email: joi.string().email().required(),
  });

  const { error, value } = schema.validate(req.query);

  if (error) {
    // console.log(error.details)
    res.redirect("/login");
    return;
  } else {
    req.xop = {
      email: value.email,
      token: value.token,
    };
    next();
  }
};

const resetPassword = (req, res, next) => {
  const schema = joi.object({
    token: joi.string().min(8).max(8).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(20).required(),
    password_confirm: joi
      .string()
      .min(8)
      .max(20)
      .required()
      .valid(joi.ref("password")),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    // console.log(error.details)
    req.flash(
      "error",
      error.details.map((err) => err.message),
    );
    res.render("reset_password", {
      title: "Reset Password",
      body: req.body,
      flashes: req.flash(),
    });
    return;
  } else {
    req.xop = {
      email: value.email,
      token: value.token,
    };
    next();
  }
};

module.exports = {
  signUpNewUser,
  loginUser,
  sendForgotPasswordMail,
  getResetPasswordForm,
  resetPassword,
};

