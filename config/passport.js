const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: "此信箱還未註冊，請先註冊帳號。",
            });
          }
          if (user.password !== password) {
            return done(null, false, {
              message: "信箱或密碼輸入錯誤，請重新輸入。",
            });
          }
          return done(null, user);
        })
        .catch(err => done(err, false));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null));
  });
};
