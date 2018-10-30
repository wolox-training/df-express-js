const axios = require('axios'),
  config = require('./../../config').common,
  jsonPlaceHolder = config.jsonPlaceHolder,
  errors = require('./../errors');

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
