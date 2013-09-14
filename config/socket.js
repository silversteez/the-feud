var questions = require('../app/controllers/questions');

module.exports = function(ioObj) {
  //length in seconds of one game question loop
  var gameCycle = 5;
  //how often to broadcast an update
  var gameBeat = 1000;
  //where are we in the cycle
  var cycleTime = 0;

  //run this every gameBeat so we can track what second of the cycle we're on
  //at the end of a cycle, do stuff
  setInterval(function() {
    cycleTime++;
    if (cycleTime >= gameCycle) {
      //broadcast new question to everyone
      //hacked to use in-memory questions so don't need to queue up next question for now
      var nextQuestion = questions.getNextQuestion();
      ioObj.sockets.emit('nextQuestion', {
        question: nextQuestion,
        gameCycle: gameCycle
      });
      cycleTime = 0;
    }
  }, gameBeat);

  //all the stuff we do that requires a connection
  ioObj.sockets.on('connection', function (socket) {
    console.log('connection!');

    socket.on('getQuestion', function() {
      var currentQuestion = questions.getCurrentQuestion();
      socket.emit('currentQuestion', {
        question: currentQuestion,
        gameCycle: gameCycle,
        cycleTimeRemaining: gameCycle - cycleTime
      });
    });
    // var emitTester = function() {
    //   socket.emit('test', { theTest: "it worked!" } );
    //   console.log( questions.getNextQuestion());
    // };
    // setInterval(emitTester, 1000);
  });

};