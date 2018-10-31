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

exports.INEXISTANT_EMAIL = 'Email does not exist';
exports.inexistentEmail = { statusCode: 400, message: exports.INEXISTANT_EMAIL };

exports.BAD_EMAIL_REQ = 'bad email request';
exports.badEmailReq = { statusCode: 400, message: exports.BAD_EMAIL_REQ };

exports.INVALID_PASSWORD_ERROR = 'Invalid Password';
exports.invalidPasswordError = { statusCode: 400, message: exports.INVALID_PASSWORD_ERROR };

exports.INVALID_TOKEN_AUTH = 'You are not logged';
exports.invalidTokenAuth = { statusCode: 401, message: exports.INVALID_TOKEN_AUTH };

exports.BAD_PASS_REQ = 'not password send';
exports.badPassReq = { statusCode: 400, message: exports.BAD_PASS_REQ };

exports.USER_ALREADY_LOG = 'User is already logged-in';
exports.userAlreadyLog = { statusCode: 400, message: exports.USER_ALREADY_LOG };

exports.INVALID_NAME = 'The Name is not correct';
exports.invalidName = { statusCode: 400, message: exports.INVALID_NAME };

exports.NOT_ADMIN_USER = 'User does not have admin Permissions';
exports.notAdminUser = { statusCode: 401, message: exports.NOT_ADMIN_USER };

exports.ALBUM_ALREADY_PURCHASED = 'User already buy the album';
exports.albumAlreadyPurchased = { statusCode: 400, message: exports.ALBUM_ALREADY_PURCHASED };

exports.INEXISTENT_ALBUM = 'Albums does not exist';
exports.inexistentAlbum = { statusCode: 404, message: exports.INEXISTENT_ALBUM };

exports.externalApi = message => {
  return { statusCode: 503, message: `The external api error is not available, actual error: ${message}` };
};

exports.INVALID_OWNERSHIP = 'You are not the owner of the albums requested';
exports.invalidOwnership = { statusCode: 401, message: exports.INVALID_OWNERSHIP };
