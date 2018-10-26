const Album = require('../models').album,
  errors = require('../errors'),
  axios = require('axios'),
  logger = require('../logger');

exports.getAndValidateAlbum = (req, res, next) => {
  const albumId = req.params.id;
  logger.info(`The User ${req.adminUser.firstName} request the album ${albumId}`);
  axios
    .get(`https://jsonplaceholder.typicode.com/albums/${albumId}`)
    .then(selectedAlbum => {
      return Album.findOne({ where: { id: albumId, user_id: req.adminUser.id } }).then(alreadyBuy => {
        if (alreadyBuy) {
          return next(errors.albumAlreadyPurchased);
        } else {
          req.albumToBuy = selectedAlbum.data;
          return next();
        }
      });
    })
    .catch(error => {
      if (error.response.status === 404) return next(errors.inexistentAlbum);
      logger.error(`JSONPlaceholder API Error. Details:${JSON.stringify(error.message)}`);
      next(error);
    });
};
