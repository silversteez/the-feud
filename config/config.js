var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'mmofftest'
    },
    port: 3000,
    db: 'mongodb://localhost/mmoffDev'
  },

  test: {
    root: rootPath,
    app: {
      name: 'mmofftest'
    },
    port: 3000,
    db: 'mongodb://localhost/mmoffTest'
  },

  production: {
    root: rootPath,
    app: {
      name: 'mmofftest'
    },
    port: 3000,
    db: 'mongodb://localhost/mmoff'
  }
};

module.exports = config[env];
