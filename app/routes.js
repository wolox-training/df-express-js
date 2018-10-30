const userController = require('./controllers/users'),
  authMiddleware = require('./middlewares/auth');

exports.init = app => {
  app.get('/users', [authMiddleware.tokenAuthentication], userController.userList);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  app.post(
    '/admin/users',
    [authMiddleware.tokenAuthentication, authMiddleware.adminAuthentication, authMiddleware.signUpValidation],
    userController.createAdmin
  );
  app.post('/users', [], userController.create);
  app.post('/users/sessions', [], userController.login);
};
