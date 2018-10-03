const logger = require('../logger'),
  User = require('../models').user;
const bcrypt = require('bcryptjs');

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
  User.findOne({ where: { email: params.email } }).then(resolve => {
    const regex = new RegExp('^[0-9A-Za-z]+$');
    if (resolve !== null) {
      return res.status(400).send('The email already exist');
    } else if (params.email && params.email.includes(emailDomain) === false) {
      // wrong domain
      return res.status(400).send('Invalid email');
    } else if ((params.contraseña && params.contraseña.length < 8) || !regex.test(params.contraseña)) {
      // short pass
      return res.status(400).send('Invalid Password');
    } else {
      // ahora vemos
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
