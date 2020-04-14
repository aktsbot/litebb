const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller')

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', userController.loginForm);
router.get('/signup', userController.signUpForm);
router.get('/forgot-password', userController.forgotPasswordForm);

module.exports = router;
