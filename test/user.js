const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should(),
  User = require('./../app/models').user,
  sessionManager = require('./../app/services/sessionManager'),
  actionToDo = require('./support/users');

describe('users', () => {
  describe('/users POST', () => {
    it('should fail because email is missing or invalid', done => {
      User.count().then(cantUsers => {
        actionToDo.createUser(actionToDo.usersList.userWithBadEmail).catch(err => {
          User.count().then(cantUsersAfter => {
            cantUsersAfter.should.be.eql(cantUsers);
            err.should.have.status(400);
            done();
          });
        });
      });
    });
    it('should fail because email is in use', done => {
      actionToDo.createUser(actionToDo.usersList.newUserOneCorrect).then(res => {
        User.count().then(cantUsers => {
          actionToDo.createUser(actionToDo.usersList.userOneCorrect).catch(err => {
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
        actionToDo.createUser(actionToDo.usersList.userWithShortPass).catch(err => {
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
        actionToDo.createUser(actionToDo.usersList.userWithInvalidPass).catch(err => {
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
        actionToDo.createUser(actionToDo.usersList.newUserThreeCorrect).then(res => {
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
      actionToDo.logUser(actionToDo.usersList.userWithBadEmail).catch(err => {
        err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
        err.should.have.status(400);
        done();
      });
    });

    it('should fail login because email dose not exist', done => {
      actionToDo.logUser(actionToDo.usersList.userWithInexistentEmail).catch(err => {
        err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
        err.should.have.status(400);
        done();
      });
    });

    it('should fail login because email is missing', done => {
      actionToDo.logUser(actionToDo.usersList.userWithoutEmail).catch(err => {
        err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
        err.should.have.status(400);
        done();
      });
    });

    it('should fail login because of invalid password', done => {
      actionToDo.logUser(actionToDo.usersList.userWithInvalidPass).catch(err => {
        err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
        err.should.have.status(400);
        done();
      });
    });

    it('should fail because user already logged in', done => {
      actionToDo.logUser(actionToDo.usersList.userInDB).then(res => {
        chai
          .request(server)
          .post('/users/sessions')
          .set('authorization', res.headers.authorization)
          .send({ email: 'maxi.mon@wolox.com.ar', password: '123456789' })
          .catch(err => {
            res.headers.should.have.property(sessionManager.HEADER_NAME);
            err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
            err.should.have.status(400);
            done();
          });
      });
    });
    it('should be successful logged in', done => {
      actionToDo.logUser(actionToDo.usersList.userInDB).then(res => {
        res.headers.should.have.property(sessionManager.HEADER_NAME);
        res.should.have.status(200);
        done();
      });
    });
  });

  describe('/users GET', () => {
    it('should get the User List successfully', done => {
      actionToDo.logUser(actionToDo.usersList.userInDB).then(res => {
        chai
          .request(server)
          .get('/users?page=1&limit=2')
          .set('authorization', res.headers.authorization)
          .send({ email: 'albert.albond@wolox.com.ar', password: '123456789' })
          .then(resolve => {
            res.headers.should.have.property(sessionManager.HEADER_NAME);
            resolve.body.length.should.be.eql(2);
            resolve.should.have.status(200);
            done();
          });
      });
    });

    it('should fail because User is not logged', done => {
      actionToDo.createUser(actionToDo.usersList.newUserOneCorrect).then(res => {
        chai
          .request(server)
          .get('/users?page=1&limit=2')
          .send({ email: 'pet.parker@wolox.com.ar', password: '123abc123' })
          .catch(err => {
            err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
            err.should.have.status(401);
            done();
          });
      });
    });
  });

  describe('/admin/users POST', () => {
    it('should fail because user is not logged', done => {
      User.findOne({ where: { email: 'maxi.mon@wolox.com.ar' } }).then(userDB => {
        actionToDo.createAdmin(actionToDo.usersList.userInDB).catch(err => {
          userDB.reload().then(reloadDB => {
            reloadDB.isAdmin.should.be.eql(false);
            err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
            err.should.have.status(401);
            done();
          });
        });
      });
    });
    it('should fail because Name does not match', done => {
      actionToDo.logUser(actionToDo.usersList.adminUserInDB).then(userLog => {
        User.findOne({ where: { email: 'juan.juarroz@wolox.com.ar' } }).then(userDB => {
          actionToDo
            .createAdmin(actionToDo.usersList.userInDBwrongName)
            .set('authorization', userLog.headers.authorization)
            .catch(err => {
              userDB.reload().then(reloadUserDB => {
                reloadUserDB.isAdmin.should.be.eql(false);
                reloadUserDB.firstName.should.be.eql('Juan');
                err.should.have.status(400);
                done();
              });
            });
        });
      });
    });
    it('should fail because password does not match', done => {
      actionToDo.logUser(actionToDo.usersList.adminUserInDB).then(userLog => {
        User.findOne({ where: { email: 'juan.juarroz@wolox.com.ar' } }).then(userDB => {
          actionToDo
            .createAdmin(actionToDo.usersList.userInDBwrongPassword)
            .set('authorization', userLog.headers.authorization)
            .catch(err => {
              userDB.reload().then(reloadUserDB => {
                reloadUserDB.isAdmin.should.be.eql(false);
                err.should.have.status(400);
                done();
              });
            });
        });
      });
    });
    it('should fail because user is not admin', done => {
      actionToDo.logUser(actionToDo.usersList.userInDB).then(userLog => {
        User.findOne({ where: { email: 'maxi.mon@wolox.com.ar' } }).then(userDB => {
          actionToDo
            .createAdmin(actionToDo.usersList.userInDB)
            .set('authorization', userLog.headers.authorization)
            .catch(err => {
              userDB.reload().then(reloadUserDB => {
                reloadUserDB.isAdmin.should.be.eql(false);
                err.should.have.status(401);
                done();
              });
            });
        });
      });
    });
    it('New Admin Should be succesfully Created', done => {
      actionToDo.logUser(actionToDo.usersList.adminUserInDB).then(userLog => {
        actionToDo
          .createAdmin(actionToDo.usersList.newAdmin)
          .set('authorization', userLog.headers.authorization)
          .then(newAdm => {
            User.findOne({ where: { email: actionToDo.usersList.newAdmin.email } }).then(newUserAdm => {
              newUserAdm.isAdmin.should.be.eql(true);
              newAdm.should.have.status(201);
              done();
            });
          });
      });
    });
    it('Admin Should be succesfully UpDated', done => {
      actionToDo.logUser(actionToDo.usersList.adminUserInDB).then(userLog => {
        actionToDo
          .createAdmin(actionToDo.usersList.updateUserToAdmin)
          .set('authorization', userLog.headers.authorization)
          .then(newAdm => {
            User.findOne({ where: { email: actionToDo.usersList.updateUserToAdmin.email } }).then(
              upDateUserAdm => {
                upDateUserAdm.isAdmin.should.be.eql(true);
                newAdm.should.have.status(200);
                done();
              }
            );
          });
      });
    });
  });
});
