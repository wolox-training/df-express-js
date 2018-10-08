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
