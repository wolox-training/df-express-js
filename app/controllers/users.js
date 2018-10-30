const logger = require('../logger'),
  User = require('../models').user,
  bcrypt = require('bcryptjs'),
  errors = require('../errors'),
  usersToShow = require('./../helpers/index').usersToShow,
  getAllAlbums = require('./../services/albums').getAlbums,
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
  const limit = req.query.limit,
    page = req.query.page,
    offset = (page - 1) * limit,
    props = {};
  User.getPagedUsers(props, offset, limit)
    .then(users => {
      logger.info(`User get the List successfull`);
      res.status(200).send(usersToShow(users));
    })
    .catch(error => {
      logger.error(`Database Error. Details: ${JSON.stringify(error)}`);
      next(error);
    });
};

exports.createAdmin = (req, res, next) => {
  if (req.newUser) {
    // Create a new Admin User
    const saltRounds = 10;
    bcrypt.hash(req.newUser.password, saltRounds).then(hash => {
      req.newUser.password = hash;
      User.create(req.newUser)
        .then(newUser => {
          logger.info(`User with email ${newUser.email} correctly created`);
          res.status(201).send({ newUser });
        })
        .catch(error => {
          logger.error(`Database Error. Details: ${JSON.stringify(error)}`);
          next(error);
        });
    });
  } else {
    // User already exist, so update him to adm
    req.userDB
      .update(req.userToUpdate)
      .then(userUpdated => {
        res.status(200);
        res.send({ User: userUpdated });
      })
      .catch(next);
  }
};

exports.getAlbums = (req, res, next) => {
  return getAllAlbums()
    .then(albumsList => {
      logger.info(`All albums listed succesfully`);
      res.send({ albums: albumsList });
      res.status(200);
    })
    .catch(next);
};
