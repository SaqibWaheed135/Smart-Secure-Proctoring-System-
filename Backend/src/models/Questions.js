const mongoose = require('mongoose');

 const QuestionSchema = new mongoose.Schema({
   
    question: { type: String, required: true, trim: true },
    options: [{ type: String, required: true, trim: true }],
    correctAnswer: { type: Number, required: true } // Index of the correct answer in the options array
});


const Question=mongoose.model('Question',QuestionSchema);
module.exports = Question;


