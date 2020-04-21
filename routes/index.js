const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const userController = require('../controllers/user.controller')
const userValidator = require('../validators/user.validator');

const settingsController = require('../controllers/settings.controller');
const settingsValidator = require('../validators/settings.validator');

const generalController = require('../controllers/general.controller');

router.get('/', authMiddleware.addUserMeta, generalController.getIndexPage);

// auth and user
router.get('/login', userController.loginForm);
router.get('/signup', userController.signUpForm);
router.get('/forgot-password', userController.forgotPasswordForm);

router.post('/signup', userValidator.signUpNewUser, userController.signupNewUser);
router.post('/login', userValidator.loginUser, userController.loginUser);
router.get('/logout', userController.logoutUser);

// settings
router.get('/settings',
  authMiddleware.isSessionActive,
  authMiddleware.addUserMeta,
  authMiddleware.isAdmin,
  settingsController.getSettingsPage);
router.get('/settings/new-board',
  authMiddleware.isSessionActive,
  authMiddleware.addUserMeta,
  authMiddleware.isAdmin,
  settingsController.getNewBoardPage)

router.post('/settings/new-board',
  authMiddleware.isSessionActive,
  authMiddleware.addUserMeta,
  authMiddleware.isAdmin,
  settingsValidator.createNewBoard,
  settingsController.createNewBoard)


module.exports = router;
