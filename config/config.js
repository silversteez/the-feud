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
    db: 'mongodb://nodejitsu_silversteez:s0f2jvums14appp6l3uof0ctg@ds039257.mongolab.com:39257/nodejitsu_silversteez_nodejitsudb8602391087'
  }
};

module.exports = config[env];
