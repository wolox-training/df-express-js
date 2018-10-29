const userController = require('./controllers/users'),
  authMiddleware = require('./middlewares/auth');

exports.init = app => {
  app.get('/users', [authMiddleware.tokenAuthentication], userController.userList);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  app.post('/users', [], userController.create);
  app.post('/users/sessions', [], userController.login);
};
