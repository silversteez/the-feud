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
    db: 'mongodb://localhost/mmofftest-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'mmofftest'
    },
    port: 3000,
    db: 'mongodb://localhost/mmofftest-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'mmofftest'
    },
    port: 3000,
    db: 'mongodb://localhost/mmofftest-production'
  }
};

module.exports = config[env];
