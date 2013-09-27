myApp.factory('user', function (socket) {
  var storage = window.localStorage;
  var user = {};

  user.saveUserNameAndPassword = function(name, pw) {
    storage.setItem('username', name);
    storage.setItem('password', pw);
  };

  user.deleteProfile = function() {
    storage.removeItem('username');
    storage.removeItem('password');
    storage.removeItem('points');
    user.username = null;
    user.points = 0;
  };

  user.savePoints = function(points) {
    storage.setItem('points', points);
  };

  user.getPoints = function() {
    var tempPoints = storage.getItem('points');
    var points;
    if (typeof tempPoints === 'string') {
      points = parseInt(tempPoints);
    } else if (tempPoints === null) {
      points = 0;
    }
    return points;
  };

  user.username = storage.getItem('username');//or just be null which equals Guest
  user.points = user.getPoints();

  return user;
});