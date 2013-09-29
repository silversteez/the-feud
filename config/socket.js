var questions = require('../app/controllers/questions');

module.exports = function(io) {
  var numTotalAnswers = 0;
  var numCurrentPlayers = 0;
  var answerScoreboard = {};
  //store the current state
  var gameState;
  //cache the next game state whenever we setState()
  var nextGameState;

  var pointsAwarded = [10,5,3,2,1];

  var addAndSaveAnswer = function (answerObj) {
    //want to do regex to strip out articles (the, a, some, maybe remove s from plural?)
    //assume one word answers for now
    var answer = answerObj.answer;
    if (!answerScoreboard[answer]) {
      answerScoreboard[answer] = 1;
    } else {
      answerScoreboard[answer]++;
    }
    console.log("answer: " + answer + ", rank: " + answerScoreboard[answer]);
  };

  var sortAnswersByScore = function() {
    var sortedAnswers = [];
    var result = [];

    for (var key in answerScoreboard) {
      sortedAnswers.push([key, answerScoreboard[key]]);
    }
    sortedAnswers.sort(function(a,b){ return b[1] - a[1]; });
    //just sending the top 5 results and discarding the rest for now
    sortedAnswers = sortedAnswers.slice(0,5);

    //create answer data object to send to clients
    for (var i = 0; i < sortedAnswers.length; i++) {
      var answerArr = sortedAnswers[i];
      var answerData = {};
      answerData.rank = i+1;
      answerData.content = answerArr[0];
      console.log("nums are ", answerArr[1], numTotalAnswers);
      answerData.percent = Math.floor(answerArr[1] / numTotalAnswers * 100) + "%";
      answerData.points = pointsAwarded[i];
      result.push(answerData);
    }

    return result;
  };


  var state = {
    question: "question",
    answer: "answer",
    transition: "transition"
  };

  var setState = function(st) {
    console.log("state is ", st);

    switch(st) {
      case state.question:
      console.log("entered case question");
      enterQuestionState();
      break;

      case state.transition:
      console.log("entered case transition");
      enterTransitionState();
      break;

      case state.answer:
      console.log("entered case answer");
      enterAnswerState();
      break;

    }
  };

  var enterQuestionState = function() {
    cycleTime = questionTime;
    cycleTotalTime = questionTime;
    gameState = state.question;
    nextGameState = state.transition;

    //broadcast new question to everyone
    //hacked to use in-memory questions so don't need to queue up next question for now
    questions.getNextQuestion();

    //reset answers on each new question for now...
    numTotalAnswers = 0;
    answerScoreboard = {};

    io.sockets.emit('newQuestion', {
      gameState: gameState,
      cycleTotalTime: cycleTotalTime,
      cycleTime: cycleTime,
      question: questions.getCurrentQuestion(),
    });
  };

  var enterTransitionState = function() {
    cycleTime = transitionTime;
    cycleTotalTime = transitionTime;
    gameState = state.transition;
    nextGameState = state.answer;

    io.sockets.emit('transToAnswer', {
      gameState: gameState,
      cycleTime: cycleTime,
      cycleTotalTime: cycleTotalTime
    });
  };

  var enterAnswerState = function() {
    cycleTime = answerTime;
    cycleTotalTime = answerTime;
    gameState = state.answer;
    nextGameState = state.question;

    io.sockets.emit('answers', {
      gameState: gameState,
      cycleTime: cycleTime,
      cycleTotalTime: cycleTotalTime,
      answers: sortAnswersByScore()
    });
  };

  var emitCycleUpdate = function() {
    io.sockets.emit('cycleUpdate', {
      gameState: gameState,
      cycleTotalTime: cycleTotalTime,
      cycleTime: cycleTime,
      numCurrentPlayers: numCurrentPlayers
    });
  };

  var emitInitialUpdate = function() {
    io.sockets.emit('initialUpdate', {
      gameState: gameState,
      cycleTotalTime: cycleTotalTime,
      cycleTime: cycleTime,
      numCurrentPlayers: numCurrentPlayers,
      question: questions.getCurrentQuestion()
    });
  };

  var questionTime = 15;
  var transitionTime = 1;
  var answerTime = 5;
  //keep a reference to the total time of the current cycle to send to clients
  var cycleTotalTime;
  //where are we in the current cycle
  var cycleTime;
  //how often to broadcast an update
  var updateBeat = 1000;

  //set the starting game state
  setState(state.question);

  //run this every updateBeat so we can track what second of the cycle we're on
  setInterval(function() {
    cycleTime--;

    if (cycleTime < 0) {
      setState(nextGameState);
    } else {
     //send out a cycle update every updateBeat to keep clients synced up
      emitCycleUpdate();
    }

    //update switch
    switch(gameState) {
      case state.question:
      break;
      case state.transition:
      break;
      case state.answer:
      break;
    }

  }, updateBeat);

  //do stuff on initial connection
  io.sockets.on('connection', function (socket) {
    numCurrentPlayers++;
    console.log("Connection type is: ", socket.transport);
    //send an update immediately on connection to let client know what state game is in
    emitInitialUpdate();

    socket.on('submitAnswer', function(data) {
      console.log('received answer! ', data);
      addAndSaveAnswer(data);
      numTotalAnswers++;
    });

    socket.on('disconnect', function() {
      numCurrentPlayers--;
    });
  });

};