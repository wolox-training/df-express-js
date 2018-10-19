const sessionManager = require('./../services/sessionManager'),
  User = require('../models').user,
  errors = require('../errors');

exports.tokenAuthentication = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (auth) {
    const email = sessionManager.decode(auth);
    User.findOne({ where: email }).then(logUser => {
      if (logUser) {
        req.userInfo = logUser;
        next();
      } else {
        return next(errors.invalidTokenAuth);
      }
    });
  } else {
    return next(errors.invalidTokenAuth);
  }
};
