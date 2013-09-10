/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    // async = require('async'),
    Question = mongoose.model('Question'),
    _ = require('underscore');

/**
 * Create a article
 */
exports.create = function(req, res) {
    var question = new Question(req.body);

    question.createdBy = req.user;
    question.save();
    res.jsonp(question);
};

exports.populate = function() {
    var questionArr = require('../models/questionData');
    _.each(questionArr, function(val) {
        var question = new Question();
        question.question = val.question;
        question.save();
    });
};

// /**
//  * Update a article
//  */
// exports.update = function(req, res) {
//     var article = req.article;

//     article = _.extend(article, req.body);

//     article.save(function(err) {
//         res.jsonp(article);
//     });
// };

// /**
//  * Delete an article
//  */
// exports.destroy = function(req, res) {
//     var article = req.article;

//     article.remove(function(err) {
//         if (err) {
//             res.render('error', {
//                 status: 500
//             });
//         } else {
//             res.jsonp(article);
//         }
//     });
// };

// /**
//  * Show an article
//  */
// exports.show = function(req, res) {
//     res.jsonp(req.article);
// };

// /**
//  * List of Articles
//  */
// exports.all = function(req, res) {
//     Article.find().sort('-created').populate('user').exec(function(err, articles) {
//         if (err) {
//             res.render('error', {
//                 status: 500
//             });
//         } else {
//             res.jsonp(articles);
//         }
//     });
// };