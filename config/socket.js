module.exports = function(ioObj) {

  ioObj.sockets.on('connection', function (socket) {
    console.log('connection!');

    socket.emit('news', { hello: 'world' });


    var emitTester = function() {
      socket.emit('test', { theTest: "it worked!" } );
    };

    setInterval(emitTester, 1000);

    socket.on('my other event', function (data) {
      console.log('"my other event" data: ', data);
    });

  });

};