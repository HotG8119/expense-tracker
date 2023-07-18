const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/user");

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());
};
