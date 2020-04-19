const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const userController = require('../controllers/user.controller')
const userValidator = require('../validators/user.validator');

const settingsController = require('../controllers/settings.controller');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// auth and user
router.get('/login', userController.loginForm);
router.get('/signup', userController.signUpForm);
router.get('/forgot-password', userController.forgotPasswordForm);

router.post('/signup', userValidator.signUpNewUser, userController.signupNewUser);
router.post('/login', userValidator.loginUser, userController.loginUser);
router.get('/logout', userController.logoutUser);

// settings
router.get('/settings', authMiddleware.isSessionActive, settingsController.getSettingsPage);
router.get('/settings/new-board', authMiddleware.isSessionActive, settingsController.getNewBoardPage)



module.exports = router;
