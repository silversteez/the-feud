'use strict';

/* Directives */
angular.module('myApp.directives', [])
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('resetProgBar', function() {
    return function(scope, elm, attrs) {
      // elm.removeClass('progress-animate').css('width', '{{progressBarVal}}%').addClass('progress-animate');

      scope.$watch('game.gameState', function() {
        elm.removeClass('progress-animate').css('width', '100%').addClass('progress-animate');
      });
    };
  })
  ;
