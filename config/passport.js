var mongoose        = require('mongoose'),
    User            = mongoose.model('User'),
    LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport) {

  //Serialize sessions
  passport.serializeUser(function(user, done) {
      done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
      User.findOne({
          _id: id
      }, function(err, user) {
          done(err, user);
      });
    });

  // Implement the passport local strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        console.log("wrong username");
        return done(null, false, { message: 'Incorrect username and/or password.' });
      }
      if (!user.validPassword(password)) {
        console.log("wrong password");
        return done(null, false, { message: 'Incorrect username and/or password.' });
      }
      return done(null, user);
    });
  }
));
};