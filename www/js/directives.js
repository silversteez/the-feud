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
      scope.$watch('game.gameState', function() {
        elm.removeClass('progress-animate').css('width', '100%').addClass('progress-animate');
      });
    };
  })
  .directive('highlightWinner', function() {
    return function(scope, elm, attrs) {
      if (scope.data.answer === scope.answer.content) {
        elm.children().removeClass('regularRow').addClass('winningRow');
      }
    };
  })
  ;
