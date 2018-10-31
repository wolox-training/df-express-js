const chai = require('chai'),
  Album = require('./../app/models').album,
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

  describe('/albums/:id POST', () => {
    it('should fail buying the album because user is not logged', done => {
      const couchdb = nock('https://jsonplaceholder.typicode.com/albums')
        .get('/1')
        .reply(200, {
          userId: 1,
          id: 1,
          title: 'omnis laborum odio'
        });
      actionToDo.logUser(actionToDo.usersList.userInDB).then(userLog => {
        Album.count().then(totalAlbumsPurchasedBeforeBuy => {
          actionToDo.buyAlbum(1).catch(err => {
            Album.count().then(totalAlbumsAfterBuy => {
              totalAlbumsAfterBuy.should.be.eql(totalAlbumsPurchasedBeforeBuy);
              err.should.have.status(401);
              done();
            });
          });
        });
      });
    });
    it('should buy the album succesfully', done => {
      const couchdb = nock('https://jsonplaceholder.typicode.com/albums')
        .get('/1')
        .reply(200, {
          userId: 1,
          id: 1,
          title: 'omnis laborum odio'
        });
      Album.count().then(totalAlbumsPurchasedBeforeBuy => {
        actionToDo.logUser(actionToDo.usersList.userInDB).then(userLog => {
          actionToDo
            .buyAlbum(1)
            .set('authorization', userLog.headers.authorization)
            .then(res => {
              Album.count().then(totalAlbumsAfterBuy => {
                totalAlbumsAfterBuy.should.be.eql(totalAlbumsPurchasedBeforeBuy + 1);
                res.should.have.status(200);
                dictum.chai(res);
                done();
              });
            });
        });
      });
    });
    it('should fail buying the album because user already buy it', done => {
      const couchdb = nock('https://jsonplaceholder.typicode.com/albums')
        .get('/1')
        .reply(200, {
          userId: 1,
          id: 1,
          title: 'omnis laborum odio'
        });
      actionToDo.logUser(actionToDo.usersList.userWithOneAlbum).then(userLog => {
        actionToDo
          .buyAlbum(1)
          .set('authorization', userLog.headers.authorization)
          .then(resolve => {
            Album.count().then(totalAlbumsPurchasedBeforeBuy => {
              actionToDo
                .buyAlbum(1)
                .set('authorization', userLog.headers.authorization)
                .catch(err => {
                  Album.count().then(totalAlbumsAfterBuy => {
                    totalAlbumsAfterBuy.should.be.eql(totalAlbumsPurchasedBeforeBuy);
                    err.should.have.status(400);
                    done();
                  });
                });
            });
          });
      });
    });
    it('should fail buying the album because album does not exist', done => {
      const couchdb = nock('https://jsonplaceholder.typicode.com/albums')
        .get('/155')
        .reply(200, {});
      actionToDo.logUser(actionToDo.usersList.userInDB).then(userLog => {
        Album.count().then(totalAlbumsPurchasedBeforeBuy => {
          actionToDo
            .buyAlbum(155)
            .set('authorization', userLog.headers.authorization)
            .catch(err => {
              Album.count().then(totalAlbumsAfterBuy => {
                totalAlbumsAfterBuy.should.be.eql(totalAlbumsPurchasedBeforeBuy);
                err.should.have.status(404);
                done();
              });
            });
        });
      });
    });
  });

  describe('/users/:user_id/albums GET', () => {
    it('should fail getting the albums because User is neither the owner nor admin', done => {
      const couchdb = nock('https://jsonplaceholder.typicode.com/albums')
        .get('/1')
        .reply(200, {
          userId: 1,
          id: 1,
          title: 'omnis laborum odio'
        });
      actionToDo.logUser(actionToDo.usersList.userInDB).then(userLog => {
        actionToDo
          .buyAlbum(1)
          .set('authorization', userLog.headers.authorization)
          .then(res => {
            actionToDo
              .getAlbumsPurchased(1)
              .set('authorization', userLog.headers.authorization)
              .catch(err => {
                err.should.have.status(401);
                done();
              });
          });
      });
    });
    it('should get the albums succesfully because user is the owner', done => {
      const couchdb = nock('https://jsonplaceholder.typicode.com/albums')
        .get('/1')
        .reply(200, {
          userId: 1,
          id: 1,
          title: 'omnis laborum odio'
        });
      actionToDo.logUser(actionToDo.usersList.userInDB).then(userLog => {
        actionToDo
          .buyAlbum(1)
          .set('authorization', userLog.headers.authorization)
          .then(res => {
            actionToDo
              .getAlbumsPurchased(3)
              .set('authorization', userLog.headers.authorization)
              .then(resolve => {
                resolve.should.have.status(200);
                dictum.chai(res);
                done();
              });
          });
      });
    });

    it('should get the albums succesfully because user is admin', done => {
      const couchdb = nock('https://jsonplaceholder.typicode.com/albums')
        .get('/1')
        .reply(200, {
          userId: 1,
          id: 1,
          title: 'omnis laborum odio'
        });
      actionToDo.logUser(actionToDo.usersList.userInDB).then(userLog => {
        actionToDo
          .buyAlbum(1)
          .set('authorization', userLog.headers.authorization)
          .then(res => {
            actionToDo.logUser(actionToDo.usersList.userWithOneAlbum).then(adminUser => {
              actionToDo
                .getAlbumsPurchased(3)
                .set('authorization', adminUser.headers.authorization)
                .then(resolve => {
                  resolve.should.have.status(200);
                  dictum.chai(res);
                  done();
                });
            });
          });
      });
    });
  });
});
