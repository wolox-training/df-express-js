const sessionManager = require('./../services/sessionManager'),
  User = require('../models').user,
  errors = require('../errors'),
  bcrypt = require('bcryptjs'),
  logger = require('../logger');

exports.tokenAuthentication = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (auth) {
    const email = sessionManager.decode(auth);
    User.findOne({ where: email }).then(logUser => {
      if (logUser) {
        req.adminUser = logUser;
        next();
      } else {
        return next(errors.invalidTokenAuth);
      }
    });
  } else {
    return next(errors.invalidTokenAuth);
  }
};

exports.adminAuthentication = (req, res, next) => {
  if (req.adminUser.isAdmin) {
    next();
  } else {
    return next(errors.notAdminUser);
  }
};

exports.signUpValidation = (req, res, next) => {
  const emailDomain = '@wolox.com.ar';
  const params = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
      }
    : {};
  const regex = new RegExp('^[0-9A-Za-z]+$');
  if (!params.email) {
    logger.info(`The email is missing`);
    return next(errors.badEmailReq);
  }
  if (!params.email.includes(emailDomain)) {
    logger.info(`User has an invalid email`);
    return next(errors.invalidEmailError);
  }
  if (!params.password) {
    logger.info(`The password is missing`);
    return next(errors.badPassReq);
  }
  if (params.password.length < 8 || !regex.test(params.password)) {
    logger.info(`User has an invalid password`);
    return next(errors.invalidPasswordError);
  }
  User.findOne({ where: { email: params.email } }).then(userDB => {
    if (!userDB) {
      req.newUser = req.body;
      next();
    } else {
      bcrypt.compare(params.password, userDB.password).then(isValid => {
        if (isValid) {
          const saltRounds = 10;
          bcrypt.hash(params.password, saltRounds).then(hash => {
            req.userDB = userDB;
            req.body.password = hash;
            next();
          });
        } else {
          return next(errors.invalidPasswordError);
        }
      });
    }
  });
};
