const errors = require('../errors'),
  config = require('./../../config').common,
  jsonPlaceHolder = config.jsonPlaceHolder,
  axios = require('axios');

exports.getAlbums = () => {
  return axios
    .get(jsonPlaceHolder.url)
    .then(albums => {
      return albums.data;
    })
    .catch(error => {
      throw errors.externalApi(error.message);
    });
};

exports.getAnAlbum = albumId => {
  return axios
    .get(`${jsonPlaceHolder.url}/${albumId}`)
    .then(selectedAlbum => {
      return selectedAlbum.data;
    })
    .catch(error => {
      if (error.response.status === 404) throw errors.inexistentAlbum;
      throw errors.externalApi(error.message);
    });
};
