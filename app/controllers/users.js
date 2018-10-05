const logger = require('../logger'),
  User = require('../models').user,
  bcrypt = require('bcryptjs'),
  errors = require('../errors');

exports.create = (req, res, next) => {
  const emailDomain = '@wolox.com.ar';
  const params = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contraseña: req.body.contraseña,
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
    } else if (!params.email.includes(emailDomain)) {
      // wrong domain
      return next(errors.invalidEmailError);
    } else if (params.contraseña.length < 8 || !regex.test(params.contraseña)) {
      // short pass
      return next(errors.invalidPasswordError);
    } else {
      // create user
      const saltRounds = 10;
      bcrypt.hash(params.contraseña, saltRounds).then(hash => {
        params.contraseña = hash;
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
