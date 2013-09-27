'use strict';

/* Services */

// Simple value service.
angular.module('myApp.services', []).
value('version', '0.1');

// phonegap ready service - listens to deviceready
myApp.factory('phonegapReady', function() {
  return function (fn) {
    var queue = [];
    var impl = function () {
      queue.push(Array.prototype.slice.call(arguments));
    };

    document.addEventListener('deviceready', function () {
      queue.forEach(function (args) {
        fn.apply(this, args);
      });
      impl = fn;
    }, false);

    return function () {
      return impl.apply(this, arguments);
    };
  };
});

myApp.factory('navSvc', function ($navigate) {
  return {
    slidePage: function (path,type) {
      $navigate.go(path,type);
    },
    back: function () {
      $navigate.back();
    }
  }
});

myApp.factory('myApi', function ($http, serverRoute) {
  var localTestRoute = "http://localHost:3000";
  return {
    signup: function(user, successFunc) {
      console.log(user);
      $http({
        method: "POST",
        url: localTestRoute + '/users',
        data: user
      })
      .success(function(data, status) {
        successFunc(data);
      })
      .error(function(data, status, headers, config) {
        console.log('signup error ', status, headers);
      });
    },
    login: function(successFunc) {

    }
  };
});

myApp.factory('geolocation', function ($rootScope, phonegapReady) {
  return {
    getCurrentPosition: function (onSuccess, onError, options) {
      navigator.geolocation.getCurrentPosition(function () {
       var that = this,
       args = arguments;

       if (onSuccess) {
         $rootScope.$apply(function () {
          onSuccess.apply(that, args);
        });
       }
     }, function () {
      var that = this,
      args = arguments;

      if (onError) {
        $rootScope.$apply(function () {
          onError.apply(that, args);
        });
      }
    },
    options);
    }
  };
});

myApp.factory('notification', function ($rootScope, phonegapReady) {
  return {
    alert: phonegapReady(function (message, alertCallback, title, buttonName) {
      navigator.notification.alert(message, function () {
        var that = this,
        args = arguments;

        $rootScope.$apply(function () {
          alertCallback.apply(that, args);
        });
      }, title, buttonName);
    }),
    confirm: phonegapReady(function (message, confirmCallback, title, buttonLabels) {
      navigator.notification.confirm(message, function () {
        var that = this,
        args = arguments;

        $rootScope.$apply(function () {
          confirmCallback.apply(that, args);
        });
      }, title, buttonLabels);
    }),
    beep: function (times) {
      navigator.notification.beep(times);
    },
    vibrate: function (milliseconds) {
      navigator.notification.vibrate(milliseconds);
    }
  };
});

myApp.factory('contacts', function ($rootScope, phonegapReady) {
  return {
    findContacts: phonegapReady(function (onSuccess, onError) {
      var options = new ContactFindOptions();
      options.filter="";
      options.multiple=true;
      var fields = ["displayName", "name"];
      navigator.contacts.find(fields, function(r){console.log("Success" +r.length);var that = this,
        args = arguments;
        if (onSuccess) {
          $rootScope.$apply(function () {
            onSuccess.apply(that, args);
          });
        }
      }, function () {
        var that = this,
        args = arguments;

        if (onError) {
          $rootScope.$apply(function () {
            onError.apply(that, args);
          });
        }
      }, options)
    })
  }
});



