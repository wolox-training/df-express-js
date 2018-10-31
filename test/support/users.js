const chai = require('chai'),
  User = require('../../app/models').user,
  server = require('./../../app');

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
    firstName: 'Maxi',
    lastName: 'Monzo',
    email: 'maxi.mon@wolox.com.ar',
    password: '123456789'
  },
  userWithOneAlbum: {
    firstName: 'Alberto',
    lastName: 'Albondiga',
    email: 'albert.albond@wolox.com.ar',
    password: '123456789'
  },
  userInDBwrongName: {
    firstName: 'wrongName',
    lastName: 'Juarros',
    email: 'juan.juarroz@wolox.com.ar',
    password: '123456789',
    isAdmin: 'true'
  },
  userInDBwrongPassword: {
    firstName: 'Juan',
    lastName: 'Juarros',
    email: 'juan.juarroz@wolox.com.ar',
    password: '123abc678',
    isAdmin: 'true'
  },
  newAdmin: {
    firstName: 'Reed',
    lastName: 'Richards',
    email: 'reed.richh@wolox.com.ar',
    password: '123456789',
    isAdmin: 'true'
  },
  updateUserToAdmin: {
    firstName: 'Maxi',
    lastName: 'Monzo',
    email: 'maxi.mon@wolox.com.ar',
    password: '123456789',
    isAdmin: 'true'
  },
  adminUserInDB: {
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

exports.logUser = userParams => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send(userParams);
};

exports.createUser = userParams => {
  return chai
    .request(server)
    .post('/users')
    .send(userParams);
};

exports.createAdmin = userParams => {
  return chai
    .request(server)
    .post('/admin/users')
    .send(userParams);
};

exports.getAlbumsInfo = () => {
  return chai.request(server).get('/albums');
};

exports.buyAlbum = albumId => {
  return chai.request(server).post(`/albums/${albumId}`);
};

exports.getAlbumsPurchased = userId => {
  return chai.request(server).get(`/users/${userId}/albums`);
};
