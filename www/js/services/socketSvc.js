myApp.factory('socket', function ($rootScope, serverRoute) {
    var socket = io.connect(serverRoute);
    var connected = false;

    socket.on('connect', function(){
      connected = true;
      socket.on('disconnect', function() {
        connected = false;
      });
    });

    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      },
      removeAllListeners: function(eventName, callback){
        socket.removeAllListeners(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function() {
            if(callback) {
              callback.apply(socket, args);
            }
          });
        });
      },
      connected: function() {
        return connected;
      }
    };
});