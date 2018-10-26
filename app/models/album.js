const errors = require('../errors'),
  config = require('./../../config'),
  paging = config.paging;

module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define(
    'album',
    {
      albumId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'id'
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        field: 'user_id'
      },
      albumTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'album_title'
      }
    },
    {
      paranoid: true,
      underscored: true
    }
  );
  return Album;
};
