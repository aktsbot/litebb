const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const userController = require('../controllers/user.controller')
const userValidator = require('../validators/user.validator');

const settingsController = require('../controllers/settings.controller');
const settingsValidator = require('../validators/settings.validator');

const generalController = require('../controllers/general.controller');

const replyController = require('../controllers/reply.controller');
const replyValidator = require('../validators/reply.validator');

const postController = require('../controllers/post.controller');
const postValidator = require('../validators/post.validator');

router.get('/', authMiddleware.addUserMeta, generalController.getIndexPage);

// auth and user
router.get('/login', userController.loginForm);
router.get('/signup', userController.signUpForm);
router.get('/forgot-password', userController.forgotPasswordForm);

router.post('/signup', userValidator.signUpNewUser, userController.signupNewUser);
router.post('/login', userValidator.loginUser, userController.loginUser);
router.get('/logout', userController.logoutUser);
router.post('/forgot-password',
  userValidator.sendForgotPasswordMail,
  userController.sendForgotPasswordMail);
router.get('/reset-password',
  userValidator.resetPassword,
  userController.getResetPasswordForm
);

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

// boards
router.get('/b/:board_slug', authMiddleware.addUserMeta, generalController.getBoardIndexPage)

// posts
router.get('/p/:post_slug', authMiddleware.addUserMeta, postController.getPostPage);
router.get('/p/:post_slug/edit', authMiddleware.addUserMeta, postController.getPostEditPage);
router.get('/b/:board_slug/new-post', authMiddleware.isSessionActive, postController.getNewPostPage)
router.post('/b/:board_id/new-post', authMiddleware.isSessionActive, postValidator.createPost, postController.createPost);
router.post('/p/:post_id/update',
  authMiddleware.isSessionActive,
  authMiddleware.addUserMeta,
  postValidator.updatePost,
  postController.updatePost);// html forms only does post for submission

// replies
router.get('/p/:post_slug/new-reply', authMiddleware.isSessionActive, replyController.getNewReplyPage);
router.post('/p/:post_id/new-reply',
  authMiddleware.isSessionActive,
  replyValidator.createNewReply,
  replyController.createNewReply);


module.exports = router;
