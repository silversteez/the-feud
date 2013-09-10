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
  question: {
    type: Schema.ObjectId,
    ref: 'Question'
  },
  answer: {
    type: String,
    default: '',
    trim: true
  }
});

/**
 * Answer Set Schema
 */
var AnswerSetSchema = new Schema({
  question: {
    type: Schema.ObjectId,
    ref: 'Question'
  },
  date: {
    type: Date,
    default: Date.now
  },
  answers: [{
    type: Schema.ObjectId,
    ref: 'Answer'
  }]
});

mongoose.model('Answer', AnswerSchema);
mongoose.model('AnswerSet', AnswerSetSchema);