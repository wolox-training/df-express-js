const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.UNIQUE_EMAIL_ERROR = 'The email already exist';
exports.uniqueEmailError = { statusCode: 400, message: exports.UNIQUE_EMAIL_ERROR };

exports.INVALID_EMAIL_ERROR = 'Invalid email';
exports.invalidEmailError = { statusCode: 400, message: exports.INVALID_EMAIL_ERROR };

exports.INVALID_PASSWORD_ERROR = 'Invalid Password';
exports.invalidPasswordError = { statusCode: 400, message: exports.INVALID_PASSWORD_ERROR };

exports.INVALID_TOKEN_AUTH = 'You are not logged';
exports.invalidTokenAuth = { statusCode: 400, message: exports.INVALID_TOKEN_AUTH };

exports.INVALID_USER_PAGE = 'Sorry, page does not exist';
exports.invalidUserPage = { statusCode: 400, message: exports.INVALID_USER_PAGE };
