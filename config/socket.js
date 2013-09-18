var questions = require('../app/controllers/questions');

module.exports = function(io) {
  var answers = [];
  //store the current state
  var gameState;
  //cache the next game state whenever we setState()
  var nextGameState;

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
      cycleTime = questionTime;
      cycleTotalTime = questionTime;
      gameState = state.question;
      nextGameState = state.transition;
      enterQuestionState();
      break;

      case state.transition:
      console.log("entered case transition");
      cycleTime = transitionTime;
      cycleTotalTime = transitionTime;
      gameState = state.transition;
      nextGameState = state.answer;
      enterTransitionState();
      break;

      case state.answer:
      console.log("entered case answer");
      cycleTime = answerTime;
      cycleTotalTime = answerTime;
      gameState = state.answer;
      nextGameState = state.question;
      enterAnswerState();
      break;

    }
  };

  var enterQuestionState = function() {
    //broadcast new question to everyone
    //hacked to use in-memory questions so don't need to queue up next question for now
    questions.getNextQuestion();

    io.sockets.emit('newQuestion', {
      gameState: gameState,
      cycleTotalTime: cycleTotalTime,
      cycleTime: cycleTime,
      question: questions.getCurrentQuestion(),
    });
  };

  var enterTransitionState = function() {
    io.sockets.emit('transToAnswer', {
      gameState: gameState,
      cycleTime: cycleTime,
      cycleTotalTime: cycleTotalTime
    });
  };

  var enterAnswerState = function() {
    io.sockets.emit('answers', {
      gameState: gameState,
      cycleTime: cycleTime,
      cycleTotalTime: cycleTotalTime,
      answers: answers
    });
  };

  var emitCycleUpdate = function() {
    var updateObj = {
      gameState: gameState,
      cycleTotalTime: cycleTotalTime,
      cycleTime: cycleTime,
    };
    // //if we are in question state, add the current question to the update
    // if (gameState === state.question) {
    //   updateObj.question = questions.getCurrentQuestion();
    // }
    io.sockets.emit('cycleUpdate', updateObj);
  };

  var questionTime = 15;
  var transitionTime = 2;
  var answerTime = 10;
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
    console.log("cycleTime is: ", cycleTime);
    cycleTime--;

    //send out a cycle update every updateBeat to keep clients synced up
    emitCycleUpdate();

    if (cycleTime <= 0) {
      setState(nextGameState);
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

  //all the stuff we do that requires a connection
  io.sockets.on('connection', function (socket) {
    console.log("Connection type is: ", socket.transport);
    //send an update immediately on connection to let client know what state game is in
    emitCycleUpdate();

    socket.on('submitAnswer', function(data) {
      console.log('received answer!');
      answerObj = {
        answer: data.answer
      };
      answers.push(answerObj);
    });
  });

};