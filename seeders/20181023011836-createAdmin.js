'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return bcrypt.hash('123456789', 10).then(hash => {
      queryInterface.bulkInsert(
        'users',
        [
          {
            firstName: 'Michael',
            lastName: 'Jordan',
            email: 'michael.jordan@demo.com',
            password: hash,
            isAdmin: 'true'
          }
        ],
        {}
      );
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
