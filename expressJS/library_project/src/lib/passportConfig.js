const passport = require('passport');
const localStrategy = require('./strategies/local.strategy');

const passportConfig = (app) => {
  localStrategy();
  app.use(passport.initialize());
  app.use(passport.session());

  // stores user in session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // retrieves user from session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

module.exports = passportConfig;
