/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Answer Schema
 */
var AnswerSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    answer: {
        type: String,
        default: '',
        trim: true
    }
});

mongoose.model('Answer', AnswerSchema);

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    asked: {
        type: Date,
        default: null
    },
    question: {
        type: String,
        default: '',
        trim: true
    },
    answerData: {},
    answers: [{
        type: Schema.ObjectId,
        ref: 'Answer'
    }]
});

mongoose.model('Question', QuestionSchema);