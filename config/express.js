var express = require('express'),
    mongoStore = require('connect-mongo')(express);

module.exports = function(app, config, passport) {
  app.configure(function () {
    app.use(express.compress());
    app.use(express.static(config.root + '/public'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(express.favicon(config.root + '/public/img/favicon.ico'));
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

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
