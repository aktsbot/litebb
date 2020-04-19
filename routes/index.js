const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller')
const userValidator = require('../validators/user.validator');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', userController.loginForm);
router.get('/signup', userController.signUpForm);
router.get('/forgot-password', userController.forgotPasswordForm);

router.post('/signup', userValidator.signUpNewUser, userController.signupNewUser);
router.post('/login', userValidator.loginUser, userController.loginUser);
router.get('/logout', userController.logoutUser);

module.exports = router;
