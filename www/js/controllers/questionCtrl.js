'use strict';

function QuestionCtrl($rootScope,$scope,game,user,navSvc) {

  $scope.game = game;
  $scope.user = user;//why is this needed just to make the user.points $watch work?

  $scope.data = {};

  $scope.data.displayName = user.username || 'Login';
  $scope.data.displayPoints = user.points;
  $scope.data.canSubmitAnswer = true;
  $scope.data.answerSubmitted = false;
  $scope.data.transToAnswer = false;
  $scope.data.clientState = null;
  $scope.data.answerTemp = null; //hack so i can clear form field.
  $scope.data.answer = null;

  $scope.progressBarVal = 100;
  //message can change depending on game state
  $scope.progressBarMsg = "Submit your answer before time's up!";
  //update progress bar
  $scope.$watch('game.cycleTime', function() {
    if ($scope.game.gameState !== 'transition') {
      $scope.progressBarVal = $scope.game.cycleTime / $scope.game.cycleTotalTime * 100;
    }
  });

  $scope.$watch('user.points', function() {
    console.log("watching user points");
    if (user.points > $scope.data.displayPoints) {
      $scope.data.displayPoints = user.points;
    }
  });

  var checkUserAnswer = function() {
    for (var i = 0; i < game.answers.length; i++) {
      var answer = game.answers[i];
      console.log("user answer: ", $scope.data.answer, " vs ", answer.content);
      if ($scope.data.answer === answer.content) {
        user.points += answer.points;
        user.savePoints(user.points);
      }
    }
  };

  $scope.$watch('game.gameState', function() {
    if ($scope.game.gameState === 'transition') {
      $scope.data.clientState = "showAnswer";
      $scope.progressBarMsg = "Time until next question...";
      $scope.data.canSubmitAnswer = false;
      $scope.data.answerSubmitted = false;
      $scope.data.transToAnswer = true;
    } else if ($scope.game.gameState === 'answer') {
      checkUserAnswer();
      $scope.data.transToAnswer = false;
      $scope.data.canSubmitAnswer = false;
      $scope.data.answerSubmitted = false;
    } else { //in question state
      $scope.data.clientState = "showQuestion";
      $scope.data.answer = null;
      $scope.data.answerTemp = '';
      $scope.data.transToAnswer = false;
      $scope.data.answerSubmitted = false;
      $scope.data.canSubmitAnswer = true;
      $scope.progressBarMsg = "Submit your answer before time's up!";
    }
  });

  $scope.submitAnswer = function() {
    $scope.data.answer = $scope.data.answerTemp
      .toLowerCase()
      .replace(/^\s+|\s+$/g, "") //trim leading/trailing whitespace
      .replace(/[^\w\s]|_/g, "") //trim non-alphanumeric chars
      .replace(/\s+/g, " "); //trim extra spaces to a single space

    $scope.data.answerTemp = '';
    var answerObj = {
      username: user.username,
      answer: $scope.data.answer
    };
    game.submitAnswer(answerObj);
    angular.element('input').blur();
    $scope.data.canSubmitAnswer = false;
    $scope.data.answerSubmitted = true;
  };


  var showModal = function() {
    $scope.data.showModal = true;
    console.log('showmodal');
  };
  $scope.hideModal = function() {
    $scope.data.showModal = false;
  };

  if (user.username === null) {
    showModal();
  }
}
