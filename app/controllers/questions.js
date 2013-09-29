/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    // async = require('async'),
    Question = mongoose.model('Question'),
    _ = require('underscore');

var currentQuestion = null;
var curQuestionIndex = 0;
var allQuestions = [];

/**
 * Create a question
 */
exports.create = function(req, res) {
    var question = new Question(req.body);

    question.createdBy = req.user;
    question.save();
};

exports.removeQuestions = function(req, res) {
    Question.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            exports.populate();
            res.send("repopulated questions from question data");
        }
    });
};

//just used to add questions from questionData.js for now
//doens't duplicate questions because question string is set to 'unique'
exports.repopulate = function() {
    var questionArr = require('../questionData');
    _.each(questionArr, function(val) {
        var question = new Question();
        question.question = val.question;
        question.save();
    });
};

exports.getCurrentQuestion = function() {
    //gets whatever the current question is
    //when people first enter the game
    return currentQuestion;
};

exports.getNextQuestion = function() {
    //increments to next question in queue
    //set currentQuestion to a question

    //currently very hacky to get things going...
    if (allQuestions.length === 0) {
        Question.find({}, 'question').exec(function(err, data) {
            data.forEach(function(item) {
                allQuestions.push(item.question);
            });
        });
    } else {
        curQuestionIndex++;
        if (curQuestionIndex >= allQuestions.length) {
            curQuestionIndex = 0;
        }

        currentQuestion = allQuestions[curQuestionIndex];
        return currentQuestion;
    }
};
