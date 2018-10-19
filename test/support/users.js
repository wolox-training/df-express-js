const chai = require('chai'),
  User = require('../../app/models').user;

exports.usersList = {
  newUserOneCorrect: {
    firstName: 'Peter',
    lastName: 'Parker',
    email: 'pet.parker@wolox.com.ar',
    password: '123abc123'
  },
  newUserTwoCorrect: {
    firstName: 'Wanda',
    lastName: 'Maximoff',
    email: 'wanda.off@wolox.com.ar',
    password: '123qwe673'
  },
  newUserThreeCorrect: {
    firstName: 'Stephen',
    lastName: 'Strange',
    email: 'stephen.strange@wolox.com.ar',
    password: '123qwe673'
  },
  userInDB: {
    firstName: 'Alberto',
    lastName: 'Albondiga',
    email: 'albert.albond@wolox.com.ar',
    password: '123456789'
  },
  userWithBadEmail: {
    firstName: 'Reed',
    lastName: 'Richards',
    email: 'badEmail',
    password: '123abc123'
  },
  userWithoutEmail: {
    firstName: 'Reed',
    lastName: 'Richards',
    password: '123abc123'
  },
  userWithInexistentEmail: {
    firstName: 'Reed',
    lastName: 'Richards',
    email: 'valid.but.inexistent@wolox.com.ar',
    password: '123abc123'
  },
  userWithShortPass: {
    firstName: 'Albert',
    lastName: 'Albondiga',
    email: 'albert.albond@wolox.com.ar',
    password: '123'
  },
  userWithInvalidPass: {
    firstName: 'Emma',
    lastName: 'Frost',
    email: 'emma.frost@wolox.com.ar',
    password: '$.re+·¿"@!d'
  }
};
