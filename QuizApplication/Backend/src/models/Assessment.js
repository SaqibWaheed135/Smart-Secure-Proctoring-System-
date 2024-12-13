const mongoose = require('mongoose');


const QuestionSchema = new mongoose.Schema({
   
    question: { type: String, required: true, trim: true },
    options: [{ type: String, required: true, trim: true }],
    correctAnswer: { type: Number, required: true } // Index of the correct answer in the options array
});

const QuizSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true  },
    description: { type: String, required: true, trim: true,  },
    start_date: { type: Date, default: null },
    end_date:{ type: Date, default: null },
    questions: [QuestionSchema],
    created_at: { type: Date, default: Date.now },
    status:{type: String, enum: [  'active', 'expired'], default: "active" }
});

const Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;


