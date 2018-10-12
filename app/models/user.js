const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'email'
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password'
      }
    },
    {
      paranoid: true,
      underscored: true
    }
  );

  User.getAll = (props, offset = 0, limit = 5) => {
    return User.findAll({
      where: props,
      offset,
      limit
    }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  return User;
};
