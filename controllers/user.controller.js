const bcrypt = require('bcrypt');
const { promisify } = require('util');
const { Op } = require("sequelize");
const bcryptHashP = promisify(bcrypt.hash);
const bcryptCompareP = promisify(bcrypt.compare);

const { User } = require('../models');

const loginForm = (req, res) => {
  res.render('login', { title: 'Log In' });
}

const signUpForm = (req, res) => {
  res.render('signup', { title: 'Sign Up' });
}

const forgotPasswordForm = (req, res) => {
  res.render('forgot_password', { title: 'Forgot Password' });
}

const signupNewUser = async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: {
        username: req.xop.username
      }
    })

    if (users.length) {
      req.flash('error', ['Username already in use']);
      res.render('signup', { title: 'Sign Up', body: req.body, flashes: req.flash() });
      return;
    }

    // we need to create the account and log the user in
    const passwordHash = await bcryptHashP(req.body.password, 10)

    const user = await User.create({
      username: req.xop.username,
      passwordHash,
      email: req.xop.email,
      role: 'regular'
    })

    // set session
    req.session.user = {
      id: user.id,
      username: user.username
    }

    res.redirect('/');
    return;
  } catch (e) {
    // next(e)
    console.log(e)
    return res.send('b0rk')
  }
}

const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.xop.username
      }
    })

    if (!user) {
      req.flash('error', ['User not found']);
      res.render('login', { title: 'Log In', body: req.body, flashes: req.flash() });
      return;
    }

    const passwordsMatch = await bcryptCompareP(req.xop.password, user.passwordHash);

    if (!passwordsMatch) {
      req.flash('error', ['Invalid Password']);
      res.render('login', { title: 'Log In', body: req.body, flashes: req.flash() });
      return;
    }

    // set session and redirect to /
    req.session.user = {
      id: user.id,
      username: user.username
    }

    res.redirect('/');
    return;

  } catch (e) {
    // next(e)
    console.log(e)
    return res.send('b0rk')
  }
}

const logoutUser = (req, res, next) => {
  req.session.destroy((err) => {
    //TODO: worry about the err

    res.redirect('/')
  })
}

module.exports = {
  loginForm,
  signUpForm,
  forgotPasswordForm,

  signupNewUser,
  loginUser,
  logoutUser
}