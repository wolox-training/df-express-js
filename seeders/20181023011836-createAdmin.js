'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          first_name: 'Carlos',
          last_name: 'Seijas',
          email: 'carlos.seijas@wolox.com.ar',
          password: '$2a$10$yZZtMbwYKlaxqzwJcboeW.x32j7.lWO5kVKBUVpy5IocDTlF9ySnq',
          is_admin: true
        }
      ],
      {}
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
