const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should(),
  User = require('./../app/models').user,
  sessionManager = require('./../app/services/sessionManager');

describe('users', () => {
  describe('/users POST', () => {
    it('should fail because email is missing or invalid', done => {
      User.count().then(cantUsers => {
        chai
          .request(server)
          .post('/users')
          .send({
            firstName: 'Wanda',
            lastName: 'Maximoff',
            email: '',
            password: '2wersdf34e'
          })
          .catch(err => {
            User.count().then(cantUsersAfter => {
              cantUsersAfter.should.be.eql(cantUsers);
              err.should.have.status(400);
              done();
            });
          });
      });
    });
    it('should fail because email is in use', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'Tony',
          lastName: 'Stark',
          email: 'tony.stark@wolox.com.ar',
          password: '123waerdfg'
        })
        .then(res => {
          User.count().then(cantUsers => {
            chai
              .request(server)
              .post('/users')
              .send({
                firstName: 'Peter',
                lastName: 'Parker',
                email: 'tony.stark@wolox.com.ar',
                password: '123edfgbnm'
              })
              .catch(err => {
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
        chai
          .request(server)
          .post('/users')
          .send({
            firstName: 'Reed',
            lastName: 'Richard',
            email: 'reed.richard@wolox.com.ar',
            password: '2'
          })
          .catch(err => {
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
        chai
          .request(server)
          .post('/users')
          .send({
            firstName: 'Juan',
            lastName: 'Carlos',
            email: 'juan.carlos@wolox.com.ar',
            password: '123,&er.·'
          })
          .catch(err => {
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
        chai
          .request(server)
          .post('/users')
          .send({
            firstName: 'Stephen',
            lastName: 'Strange',
            email: 'steph.strange@wolox.com.ar',
            password: '123waerdfg'
          })
          .then(res => {
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
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'invalidEmail', password: '123abc123' })
        .catch(err => {
          err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
          err.should.have.status(400);
          done();
        });
    });

    it('should fail login because email dose not exist', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'inexistent.email@wolox.com', password: '123abc123' })
        .catch(err => {
          err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
          err.should.have.status(400);
          done();
        });
    });

    it('should fail login because email is missing', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({ password: '123abc123' })
        .catch(err => {
          err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
          err.should.have.status(400);
          done();
        });
    });

    it('should fail login because of invalid password', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'albert.albond@wolox.com.ar', password: '123' })
        .catch(err => {
          err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
          err.should.have.status(400);
          done();
        });
    });

    it('should fail because user already logged in', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'juan.juarroz@wolox.com.ar', password: '123456789' })
        .then(res => {
          chai
            .request(server)
            .post('/users/sessions')
            .set('authorization', res.headers.authorization)
            .send({ email: 'juan.juarroz@wolox.com.ar', password: '123456789' })
            .catch(err => {
              res.headers.should.have.property(sessionManager.HEADER_NAME);
              err.response.headers.should.not.have.property(sessionManager.HEADER_NAME);
              err.should.have.status(400);
              done();
            });
        });
    });
    it('should be successful logged in', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({ email: 'maxi.mon@wolox.com.ar', password: '123456789' })
        .then(res => {
          res.headers.should.have.property(sessionManager.HEADER_NAME);
          res.should.have.status(200);
          done();
        });
    });
  });
});
