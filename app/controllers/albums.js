const logger = require('../logger'),
  errors = require('../errors'),
  axios = require('axios'),
  allAlbums = require('./../services/albums'),
  Album = require('../models').album;

exports.getAlbums = (req, res, next) => {
  return allAlbums
    .getAlbums()
    .then(albumsList => {
      logger.info(`All albums listed succesfully`);
      res.send({ albums: albumsList });
      res.status(200);
    })
    .catch(next);
};

exports.buyAlbum = (req, res, next) => {
  const albumToPurchase = {
    albumId: req.albumToBuy.id,
    userId: req.adminUser.id,
    albumTitle: req.albumToBuy.title
  };
  return Album.create(albumToPurchase)
    .then(purchasedAlbum => {
      logger.info(`The album ${purchasedAlbum.albumTitle} correctly purchased`);
      res.status(200).send({ 'New Album': purchasedAlbum });
    })
    .catch(error => {
      logger.error(`Database Error. Details: ${JSON.stringify(error.message)}`);
      return next(errors.inexistentAlbum);
    });
};
