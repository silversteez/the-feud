'use strict';

function LoginCtrl($scope,user) {

    $scope.user = user;

    $scope.data = {};
    $scope.data.username = null;
    $scope.data.password = null;

    //change this to show logout stuff if user is logged in
    if (user.username === null) {
        $scope.data.showLogin = true;
    } else {
        $scope.data.showLogin = false;
    }

    $scope.submit = function() {
        user.username = $scope.data.username;
        user.saveUserNameAndPassword($scope.data.username, $scope.data.password);
        $scope.data.username = '';
        $scope.data.password = '';
        angular.element('input').blur();
        $scope.data.showLogin = false;
    };

    $scope.deleteProfile = function() {
        user.deleteProfile();
        $scope.data.showLogin = true;
    }
}