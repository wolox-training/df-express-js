const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should(),
  User = require('./../app/models').user;

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
});
