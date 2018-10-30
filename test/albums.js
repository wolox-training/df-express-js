const chai = require('chai'),
  dictum = require('dictum.js'),
  nock = require('nock'),
  actionToDo = require('./support/users');

describe('albums', () => {
  describe('/albums GET', () => {
    beforeEach(() => {
      const couchdb = nock('https://jsonplaceholder.typicode.com')
        .get('/albums')
        .reply(200, [
          {
            userId: 1,
            id: 1,
            title: 'quidem molestiae enim'
          },
          {
            userId: 1,
            id: 2,
            title: 'sunt qui excepturi placeat culpa'
          }
        ]);
    });
    it('should get the albums information succesfully', done => {
      actionToDo.logUser(actionToDo.usersList.userInDB).then(userLog => {
        actionToDo
          .getAlbumsInfo()
          .set('authorization', userLog.headers.authorization)
          .then(res => {
            res.should.have.status(200);
            res.body.albums.length.should.be.eql(2);
            dictum.chai(res);
            done();
          });
      });
    });
    it('should fail getting the albums information because user is not logged', done => {
      actionToDo.logUser(actionToDo.usersList.userInDB).then(userLog => {
        actionToDo.getAlbumsInfo().catch(err => {
          err.response.body.should.not.have.property('userId');
          err.should.have.status(401);
          done();
        });
      });
    });
  });
});
