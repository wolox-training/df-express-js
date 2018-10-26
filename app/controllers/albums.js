const logger = require('../logger'),
  errors = require('../errors'),
  axios = require('axios'),
  Album = require('../models').album;

exports.getAlbums = (req, res, next) => {
  axios
    .get('https://jsonplaceholder.typicode.com/albums')
    .then(response => {
      logger.info(`All albums were listed succesfully`);
      res.send(response.data);
      res.status(200);
    })
    .catch(error => {
      logger.error(`JSONPlaceholder API Error. Details:${JSON.stringify(error)}`);
      next(error);
    });
};

exports.buyAlbum = (req, res, next) => {
  logger.info(`The User ${req.adminUser.firstName} is about to buy an album`);
  const albumToPurchase = {
    albumId: req.albumToBuy.id,
    userId: req.adminUser.id,
    albumTitle: req.albumToBuy.title
  };
  return Album.create(albumToPurchase)
    .then(purchasedAlbum => {
      logger.info(`The album ${purchasedAlbum.albumTitle} correctly purchased`);
      res.status(200).send({ purchasedAlbum });
    })
    .catch(error => {
      logger.error(`Database Error. Details: ${JSON.stringify(error.message)}`);
      return next(errors.inexistentAlbum);
    });
};
