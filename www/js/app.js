'use strict';

var myApp = angular.module('myApp', ['myApp.services', 'myApp.directives','ajoslin.mobile-navigate','ngMobile'])
    // .constant('serverRoute', 'http://questiongame.jit.su:80')
    .constant('serverRoute', 'http://localhost:3000')
    .config(function ($compileProvider){
        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/questionView.html', controller: 'QuestionCtrl'});
        $routeProvider.when('/login', {templateUrl: 'partials/loginView.html'});
        $routeProvider.otherwise({redirectTo: '/'});
  }]);
