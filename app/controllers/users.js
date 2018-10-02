const logger = require('../logger'),
  User = require('../models').user;

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
  if (params.email && params.email.includes(emailDomain) === false) {
    // wrong domain
    return res.status(400).send('Invalid email');
  } else if (params.contraseña && params.contraseña.length < 8) {
    // short pass
    return res.status(400).send('Invalid Password');
  } else {
    // ahora vemos
    User.create(params)
      .then(newUser => {
        logger.info(`User with email ${newUser.email} correctly created`);
        res.status(200).send({ newUser });
      })
      .catch(error => {
        logger.error(`Database Error. Details: ${JSON.stringify(error)}`);
        next(error);
      });
  }
};
