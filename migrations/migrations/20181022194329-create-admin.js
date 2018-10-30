'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'is_admin', {
      allowNull: true,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'is_admin');
  }
};
