const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should();

describe('users', () => {
  describe('/users POST', () => {
    it('should fail because email is missing or invalid', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'Wanda',
          lastName: 'Maximoff',
          email: '',
          password: '123ertyuiop'
        })
        .catch(err => {
          err.should.have.status(400);
          done();
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
          chai
            .request(server)
            .post('/users')
            .send({
              firstName: 'Peter',
              lastName: 'Parker',
              email: 'tony.stark@wolox.com.ar',
              password: 'password'
            })
            .catch(err => {
              err.should.have.status(400);
              done();
            });
        });
    });
    it('should fail because password is too short', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'Reed',
          lastName: 'Richards',
          email: 'reed.richards@wolox.com.ar',
          password: '2'
        })
        .catch(err => {
          err.should.have.status(400);
          done();
        });
    });
    it('should fail because password is non-alphanumeric', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'Steve',
          lastName: 'Rogers',
          email: 'steve.rogers@wolox.com.ar',
          password: '2.·%dasd'
        })
        .catch(err => {
          err.should.have.status(400);
          done();
        });
    });
    it('should be successful', done => {
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
          res.should.have.status(200);
          res.should.be.json;
          dictum.chai(res);
          done();
        });
    });
  });
});
