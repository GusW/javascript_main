const express = require('express');
const debug = require('debug')('app:authRouter');
const passport = require('passport');
const { userCollection } = require('../lib/mongoConn');

const authRouter = express.Router();

const router = (appNav) => {
  authRouter.route('/signUp').post((req, res) => {
    debug(req.body);
    const addUser = async (username, password) => {
      let client;
      try {
        const { dbClient, collection } = await userCollection();
        client = dbClient;
        const user = { username, password };
        const result = await collection.insertOne(user);
        debug(result);
        dbClient.close();
        req.login(result.ops[0], () => {
          res.redirect('/auth/profile');
        });
      } catch (err) {
        debug(err.stack);
      } finally {
        if (client != null) {
          client.close();
        }
      }
    };
    const { username, password } = req.body;
    addUser(username, password);
  });

  authRouter
    .route('/signIn')
    .get((req, res) => {
      res.render('signIn', { appNav, title: 'Sing In' });
    })
    .post(
      passport.authenticate('local', {
        successRedirect: '/auth/profile',
        failureRedirect: '/',
      }),
    );

  authRouter.route('/logout').get((req, res) => {
    if (req.user) {
      req.logout();
      res.redirect('/');
    }
  });

  authRouter
    .route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      res.json(req.user);
    });

  return authRouter;
};

module.exports = router;
