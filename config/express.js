var express = require('express'),
    mongoStore = require('connect-mongo')(express);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};

module.exports = function(app, config, passport) {
  app.configure(function () {
    app.use(express.compress());
    app.use(express.static(config.root + '/www'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(express.favicon(config.root + '/public/img/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);

    app.use(express.cookieParser());

    //express/mongo session storage
    app.use(express.session({
      secret: 'MATTY',
      store: new mongoStore({
        url: config.db,
        collection: 'sessions'
      })
    }));

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);
    app.use(function(req, res) {
      res.status(404).render('404', { title: '404' });
    });
  });
};
