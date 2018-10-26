const controller = require('./controllers/users'),
  controllerAlbums = require('./controllers/albums'),
  middleware = require('./middlewares/auth'),
  authAlbumBuy = require('./services/purchase-auth');

exports.init = app => {
  app.get('/users', [middleware.tokenAuthentication], controller.userList);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  app.post(
    '/admin/users',
    [middleware.tokenAuthentication, middleware.adminAuthentication, middleware.signUpValidation],
    controller.createAdmin
  );
  app.post('/users', [], controller.create);
  app.post('/users/sessions', [], controller.login);
  app.post(
    '/albums/:id',
    [middleware.tokenAuthentication, authAlbumBuy.getAndValidateAlbum],
    controllerAlbums.buyAlbum
  );
  app.get('/albums', [middleware.tokenAuthentication], controllerAlbums.getAlbums);
};
