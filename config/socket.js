var questions = require('../app/controllers/questions');

module.exports = function(ioObj) {
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
      break;

      case state.answer:
      console.log("entered case answer");
      cycleTime = answerTime;
      cycleTotalTime = answerTime;
      gameState = state.answer;
      nextGameState = state.question;
      break;

    }
  };

  var enterQuestionState = function() {
    //broadcast new question to everyone
    //hacked to use in-memory questions so don't need to queue up next question for now
    var nextQuestion = questions.getNextQuestion();
    ioObj.sockets.emit('nextQuestion', {
      question: nextQuestion,
      cycleTotalTime: cycleTotalTime
    });
  };

  var emitCycleUpdate = function() {
    var updateObj = {
      gameState: gameState,
      cycleTotalTime: cycleTotalTime,
      cycleTime: cycleTime,
    };
    //if we are in question state, add the current question to the update
    if (gameState === state.question) {
      updateObj.question = questions.getCurrentQuestion();
    }
    ioObj.sockets.emit('cycleUpdate', updateObj);
  };

  var questionTime = 15;
  var transitionTime = 5;
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
    if (cycleTime <= 0) {
      setState(nextGameState);
    }
    //update switch
    switch(gameState) {
      case state.question:
      break;
      case state.answer:
      break;
      case state.transition:
      break;
    }

    //send out a cycle update every updateBeat to keep clients synced up
    emitCycleUpdate();
    console.log(gameState);
    console.log(cycleTotalTime);

  }, updateBeat);

  //all the stuff we do that requires a connection
  ioObj.sockets.on('connection', function (socket) {
    //send an update immediately on connection to let client know what state game is in
    emitCycleUpdate();

    socket.on('submitAnswer', function(data) {
      answers.push(data.answer);
    });
  });

};