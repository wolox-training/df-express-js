const userController = require('./controllers/users'),
  authMiddleware = require('./middlewares/auth'),
  albumsController = require('./controllers/albums');

exports.init = app => {
  app.get('/users', [authMiddleware.tokenAuthentication], userController.userList);
  app.post(
    '/admin/users',
    [authMiddleware.tokenAuthentication, authMiddleware.adminAuthentication, authMiddleware.signUpValidation],
    userController.createAdmin
  );
  app.post(
    '/albums/:id',
    [authMiddleware.tokenAuthentication, authMiddleware.validateAlbumBuy],
    albumsController.buyAlbum
  );
  app.post('/users', [], userController.create);
  app.post('/users/sessions', [], userController.login);
  app.get('/albums', [authMiddleware.tokenAuthentication], albumsController.getAlbums);
  app.get(
    '/users/:user_id/albums',
    [authMiddleware.tokenAuthentication, authMiddleware.userValidation],
    albumsController.purchasedAlbums
  );
  app.get(
    '/users/albums/:id/photos',
    [authMiddleware.tokenAuthentication, authMiddleware.albumsOwnerValidation],
    albumsController.getAlbumsPhotos
  );
};
