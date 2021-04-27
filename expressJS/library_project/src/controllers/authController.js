const debug = require('debug')('app:authController');
const passport = require('passport');

const { userCollection } = require('../lib/mongoConn');

const authController = (appNav) => {
  const authMiddleware = (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  };

  const newUser = async (req, res) => {
    try {
      const user = req.body;
      const { dbClient, collection } = await userCollection();
      const result = await collection.insertOne(user);
      dbClient.close();
      req.login(result.ops[0], () => {
        res.redirect('/auth/profile');
      });
      dbClient.close();
    } catch (error) {
      debug(error.stack);
    }
  };

  const signInIndex = (_req, res) => {
    try {
      res.render('signIn', { appNav, title: 'Sing In' });
    } catch (error) {
      debug(error.stack);
    }
  };

  const signInUser = passport.authenticate('local', {
    successRedirect: '/auth/profile',
    failureRedirect: '/',
  });

  const logOutUser = (req, res) => {
    if (req.user) {
      req.logout();
      res.redirect('/');
    }
  };

  const userProfile = (req, res) => {
    res.json(req.user);
  };

  return {
    authMiddleware,
    newUser,
    signInIndex,
    signInUser,
    logOutUser,
    userProfile,
  };
};

module.exports = authController;
