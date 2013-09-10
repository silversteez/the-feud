var express = require('express'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  config = require('./config/config'),
  passport = require('passport');

var io = require('socket.io');

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var modelsPath = __dirname + '/app/models';
fs.readdirSync(modelsPath).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(modelsPath + '/' + file);
  }
});

require('./config/passport')(passport);

var app = express();

require('./config/express')(app, config, passport);
require('./config/routes')(app, passport);

require('./app/controllers/questions').populate();

io.listen(app.listen(config.port)).on('connection', function(socket){
  console.log("socket connected!");
  socket.on('message', function(msg) {
    console.log('received: ', msg);
    socket.broadcast.emit('message', msg);
  });
});
