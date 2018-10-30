const sessionManager = require('./../services/sessionManager'),
  User = require('../models').user,
  errors = require('../errors'),
  bcrypt = require('bcryptjs'),
  Album = require('../models').album,
  allAlbums = require('./../services/albums'),
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
        email: req.body.email,
        isAdmin: true
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
  return User.findOne({ where: { email: params.email } }).then(userDB => {
    if (!userDB) {
      req.newUser = params;
      return next();
    }
    if (userDB.firstName !== params.firstName || userDB.lastName !== params.lastName) {
      return next(errors.invalidName);
    }
    return bcrypt.compare(params.password, userDB.password).then(isValid => {
      if (isValid) {
        const saltRounds = 10;
        return bcrypt.hash(params.password, saltRounds).then(hash => {
          req.userDB = userDB;
          params.password = hash;
          req.userToUpdate = params;
          next();
        });
      } else {
        return next(errors.invalidPasswordError);
      }
    });
  });
};

exports.validateAlbumBuy = (req, res, next) => {
  const albumId = req.params.id;
  logger.info(`The User ${req.adminUser.firstName} request the album ${albumId}`);
  return allAlbums
    .getAnAlbum(albumId)
    .then(selectedAlbum => {
      return Album.findOne({ where: { id: albumId, user_id: req.adminUser.id } }).then(alreadyBuy => {
        if (alreadyBuy) {
          return next(errors.albumAlreadyPurchased);
        } else {
          req.albumToBuy = selectedAlbum;
          return next();
        }
      });
    })
    .catch(error => {
      console.log(error);
      next(error);
    });
};
