const express = require('express');

const authController = require('../controllers/authController');

const authRouter = express.Router();

const router = (appNav) => {
  const {
    authMiddleware,
    newUser,
    signInIndex,
    signInUser,
    logOutUser,
    userProfile,
  } = authController(appNav);

  authRouter.route('/signUp').post(newUser);

  authRouter.route('/signIn').get(signInIndex).post(signInUser);

  authRouter.route('/logout').get(logOutUser);

  authRouter.route('/profile').all(authMiddleware).get(userProfile);

  return authRouter;
};

module.exports = router;
