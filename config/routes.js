module.exports = function(app, passport){

  //home route
  var home = require('../app/controllers/home');
  app.get('/', home.index);

  //User Routes
  var users = require('../app/controllers/users');
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/signout', users.signout);

  //Setting up the users api
  app.post('/users', users.create);
  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: 'Invalid email or password.'
  }), users.session);
  app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

};
