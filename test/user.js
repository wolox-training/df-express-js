const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should(),
  User = require('./../app/models').user,
  sessionManager = require('./../app/services/sessionManager');

const usersList = {
  userOneCorrect: {
    firstName: 'Peter',
    lastName: 'Parker',
    email: 'pet.parker@wolox.com.ar',
    password: '123abc123'
  },
  userTwoCorrect: {
    firstName: 'Wanda',
    lastName: 'Maximoff',
    email: 'wanda.off@wolox.com.ar',
    password: '123qwe673'
  },
  userThreeCorrect: {
    firstName: 'Stephen',
    lastName: 'Strange',
    email: 'stephen.strange@wolox.com.ar',
    password: '123qwe673'
  },
  userWithBadEmail: {
    firstName: 'Reed',
    lastName: 'Richards',
    email: 'badEmail',
    password: '123qwe673'
  },
  userWithShortPass: {
    firstName: 'Victor',
    lastName: 'Von Doom',
    email: 'victor.doom@wolox.com.ar',
    password: '123'
  },
  userWithInvalidPass: {
    firstName: 'Emma',
    lastName: 'Frost',
    email: 'emma.frost@wolox.com.ar',
    password: '$.re+·¿"@!d'
  }
};

const createAnUser = choosenUser => {
  return chai
    .request(server)
    .post('/users')
    .send(choosenUser);
};
const logAnUser = choosenUser => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send(choosenUser);
};

describe('users', () => {
  describe('/users POST', () => {
    it('should fail because email is missing or invalid', done => {
      User.count().then(cantUsers => {
        createAnUser(usersList.userWithBadEmail).catch(err => {
          User.count().then(cantUsersAfter => {
            cantUsersAfter.should.be.eql(cantUsers);
            err.should.have.status(400);
            done();
          });
        });
      });
    });
    it('should fail because email is in use', done => {
      createAnUser(usersList.userOneCorrect).then(res => {
        User.count().then(cantUsers => {
          createAnUser(usersList.userOneCorrect).catch(err => {
            User.count().then(cantUsersAfter => {
              cantUsersAfter.should.be.eql(cantUsers);
              err.should.have.status(400);
              done();
            });
          });
        });
      });
    });
    it('should fail because password is too short', done => {
      User.count().then(cantUsers => {
        createAnUser(usersList.userWithShortPass).catch(err => {
          User.count().then(cantUsersAfter => {
            cantUsersAfter.should.be.eql(cantUsers);
            err.should.have.status(400);
            done();
          });
        });
      });
    });
    it('should fail because password is non-alphanumeric', done => {
      User.count().then(cantUsers => {
        createAnUser(usersList.userWithInvalidPass).catch(err => {
          User.count().then(cantUsersAfter => {
            cantUsersAfter.should.be.eql(cantUsers);
            err.should.have.status(400);
            done();
          });
        });
      });
    });
    it('should be successful', done => {
      User.count().then(cantUsers => {
        createAnUser(usersList.userThreeCorrect).then(res => {
          User.count().then(cantUsersAfter => {
            cantUsersAfter.should.be.eql(cantUsers + 1);
            res.should.have.status(200);
            res.should.be.json;
            dictum.chai(res);
            done();
          });
        });
      });
    });
  });

  describe('/users/sessions POST', () => {
    it('should fail login because of invalid email', done => {
      logAnUser(usersList.userWithBadEmail).catch(err => {
        err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
        err.should.have.status(400);
        done();
      });
    });

    it('should fail login because of invalid password', done => {
      logAnUser(usersList.userWithInvalidPass).catch(err => {
        err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
        err.should.have.status(400);
        done();
      });
    });

    it('should fail because user already logged in', done => {
      createAnUser(usersList.userOneCorrect).then(() => {
        logAnUser(usersList.userOneCorrect).then(res => {
          logAnUser(usersList.userOneCorrect)
            .set('authorization', res.headers.authorization)
            .then(resolve => {
              res.headers.should.have.property(sessionManager.HEADER_NAME);
              resolve.should.have.status(200);
              done();
            });
        });
      });
    });
    it('should be successful logged in', done => {
      createAnUser(usersList.userTwoCorrect).then(() => {
        logAnUser(usersList.userTwoCorrect).then(res => {
          res.headers.should.have.property(sessionManager.HEADER_NAME);
          res.should.have.status(200);
          done();
        });
      });
    });
  });

  describe('/users/:id POST', () => {
    it('should get the User List successfully', done => {
      createAnUser(usersList.userOneCorrect).then(() => {
        createAnUser(usersList.userTwoCorrect).then(() => {
          createAnUser(usersList.userThreeCorrect).then(() => {
            logAnUser(usersList.userTwoCorrect).then(res => {
              chai
                .request(server)
                .get('/users/1')
                .set('authorization', res.headers.authorization)
                .send({ email: 'pet.parker@wolox.com.ar', password: '123abc123' })
                .then(resolve => {
                  res.headers.should.have.property(sessionManager.HEADER_NAME);
                  resolve.body.usersDB.length.should.be.eql(2);
                  resolve.should.have.status(200);
                  done();
                });
            });
          });
        });
      });
    });

    it('should fail because User is not logged', done => {
      createAnUser(usersList.userOneCorrect).then(res => {
        chai
          .request(server)
          .get('/users/1')
          .send({ email: 'pet.parker@wolox.com.ar', password: '123abc123' })
          .catch(err => {
            err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
            err.should.have.status(400);
            done();
          });
      });
    });

    it('should fail because Page does not exist', done => {
      createAnUser(usersList.userOneCorrect).then(() => {
        logAnUser(usersList.userOneCorrect).then(res => {
          chai
            .request(server)
            .get('/users/2')
            .set('authorization', res.headers.authorization)
            .send({ email: 'pet.parker@wolox.com.ar', password: '123abc123' })
            .catch(err => {
              res.headers.should.have.property(sessionManager.HEADER_NAME);
              err.response.body.should.not.have.property('usersDB');
              err.should.have.status(400);
              done();
            });
        });
      });
    });
  });
});
