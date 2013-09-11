module.exports = function(ioObj) {

  ioObj.sockets.on('connection', function (socket) {
    console.log('connection!');

    socket.emit('news', { hello: 'world' });

    socket.on('my other event', function (data) {
      console.log('"my other event" data: ', data);
    });

  });

};