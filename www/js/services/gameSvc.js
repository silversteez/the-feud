myApp.factory('game', function (socket,user) {
  var game = {};
  game.gameState = null;
  game.question = null;
  game.cycleTime = null;
  game.cycleTotalTime = null;
  game.answers = null;
  game.numCurrentPlayers = 0;

  var updateGameState = function (state, cycleTotalTime) {
    //only update if it's changed (so we don't update $scope constantly)
    if (game.gameState !== state) {
      game.gameState = state;
      game.cycleTotalTime = cycleTotalTime;
      console.log("changed game state to ", game.gameState);
    }
  };

  socket.on('initialUpdate', function(data) {
    game.question = data.question;
    updateGameState(data.gameState, data.cycleTotalTime);
    game.cycleTime = data.cycleTime;
    game.numCurrentPlayers = data.numCurrentPlayers;
  });

  socket.on('cycleUpdate', function(data) {
    // console.log("cycleUpdate ", data.gameState);
    updateGameState(data.gameState, data.cycleTotalTime);
    //updata cycleTime every update
    game.cycleTime = data.cycleTime;
    game.numCurrentPlayers = data.numCurrentPlayers;
  });

  socket.on('newQuestion', function(data) {
    // console.log("newQuestion ", data.gameState);
    updateGameState(data.gameState, data.cycleTotalTime);
    game.question = data.question;
  });

  socket.on('transToAnswer', function(data) {
    // console.log("transToAnswer ", data.gameState);
    updateGameState(data.gameState, data.cycleTotalTime);
  });

  socket.on('answers', function(data) {
    // console.log("answers ", data.gameState);
    updateGameState(data.gameState, data.cycleTotalTime);
    game.answers = data.answers;
  });

  game.submitAnswer = function(answerObj) {
    socket.emit('submitAnswer', answerObj);
  };

  return game;
});