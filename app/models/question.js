/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
  question: {
    type: String,
    default: '',
    trim: true,
    required: true,
    unique: true
  },
  answerSets: [{
    type: Schema.ObjectId,
    ref: 'AnswerSet'
  }]
});

 mongoose.model('Question', QuestionSchema);