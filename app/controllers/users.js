const logger = require('../logger'),
  User = require('../models').user,
  bcrypt = require('bcryptjs'),
  errors = require('../errors'),
  sessionManager = require('./../services/sessionManager');

exports.create = (req, res, next) => {
  const emailDomain = '@wolox.com.ar';
  const params = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
      }
    : {};
  logger.info(
    `Attempting to create user with name ${params.firstName} ${params.lastName} and email ${params.email}`
  );
  User.findOne({ where: { email: params.email } }).then(userEmail => {
    const regex = new RegExp('^[0-9A-Za-z]+$');
    if (userEmail) {
      return next(errors.uniqueEmailError);
    } else if (!params.email || !params.email.includes(emailDomain)) {
      // wrong domain
      return next(errors.invalidEmailError);
    } else if (!params.password || params.password.length < 8 || !regex.test(params.password)) {
      // short pass
      return next(errors.invalidPasswordError);
    } else {
      // create user
      const saltRounds = 10;
      bcrypt.hash(params.password, saltRounds).then(hash => {
        params.password = hash;
        User.create(params)
          .then(newUser => {
            logger.info(`User with email ${newUser.email} correctly created`);
            res.status(200).send({ newUser });
          })
          .catch(error => {
            logger.error(`Database Error. Details: ${JSON.stringify(error)}`);
            next(error);
          });
      });
    }
  });
};

exports.login = (req, res, next) => {
  const params = req.body
      ? {
          email: req.body.email,
          password: req.body.password
        }
      : {},
    emailDomain = '@wolox.com.ar',
    regex = new RegExp('^[0-9A-Za-z]+$'),
    headerToken = req.headers.authorization;
  logger.info(`Attempting to log user with email ${params.email}`);
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
  const token = sessionManager.encode({ email: params.email });
  return User.findOne({ where: { email: params.email } })
    .then(userDB => {
      if (!userDB) {
        logger.info(`User does not exist`);
        return next(errors.inexistentEmail);
      }
      if (!headerToken || headerToken !== token) {
        bcrypt.compare(params.password, userDB.password).then(isValid => {
          if (isValid) {
            logger.info(`User correctly Sign in`);
            res.set(sessionManager.HEADER_NAME, token);
            res.status(200).send({ userDB });
          } else {
            logger.info(`User has an invalid password`);
            return next(errors.invalidPasswordError);
          }
        });
      } else {
        logger.info(`User is already logged-in`);
        return next(errors.userAlreadyLog);
      }
    })
    .catch(error => {
      logger.error(`Database Error. Details: ${JSON.stringify(error)}`);
      return next(error);
    });
};

exports.userList = (req, res, next) => {
  const limit = 2,
    page = req.params.page,
    offset = (page - 1) * limit,
    props = {};
  User.getAll(props, offset, limit)
    .then(usersDB => {
      if (usersDB.length > 0) {
        logger.info(`User get the List successfull`);
        res.status(200).send({ usersDB });
      } else {
        return next(errors.invalidUserPage);
      }
    })
    .catch(error => {
      logger.error(`Database Error. Details: ${JSON.stringify(error)}`);
      next(error);
    });
};
