const bcrypt = require('bcryptjs'),
  User = require('../app/models').user;

exports.execute = () => {
  return bcrypt
    .hash('123456789', 10)
    .then(hash => {
      const data = [];
      data.push(
        User.create({
          firstName: 'Alberto',
          lastName: 'Albondiga',
          email: 'albert.albond@wolox.com.ar',
          password: hash,
          isAdmin: 'true'
        })
      );
      data.push(
        User.create({
          firstName: 'Juan',
          lastName: 'Juarros',
          email: 'juan.juarroz@wolox.com.ar',
          password: hash
        })
      );
      data.push(
        User.create({
          firstName: 'Maxi',
          lastName: 'Monzo',
          email: 'maxi.mon@wolox.com.ar',
          password: hash
        })
      );
      return Promise.all(data);
    })
    .catch(bcryptErr => {
      throw bcryptErr;
    });
};
