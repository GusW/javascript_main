const passport = require('passport');
const debug = require('debug')('app:lib.local.strategy');
const { Strategy } = require('passport-local');
const { userCollection } = require('../mongoConn');

const localStrategy = () => {
  passport.use(
    new Strategy(
      { usernameField: 'username', passwordField: 'password' },
      async (username, password, done) => {
        const user = { username, password };
        let client;
        try {
          const { dbClient, collection } = await userCollection();
          client = dbClient;
          const persistedUser = await collection.findOne({ username });
          debug(persistedUser);
          if (persistedUser != null && persistedUser.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (err) {
          debug(err.stack);
        } finally {
          if (client != null) {
            client.close();
          }
        }
      },
    ),
  );
};

module.exports = localStrategy;
