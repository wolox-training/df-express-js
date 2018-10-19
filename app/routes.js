const controller = require('./controllers/users'),
  middleware = require('./middlewares/auth');

exports.init = app => {
  app.get('/users', [middleware.tokenAuthentication], controller.userList);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  app.post('/users', [], controller.create);
  app.post('/users/sessions', [], controller.login);
};
