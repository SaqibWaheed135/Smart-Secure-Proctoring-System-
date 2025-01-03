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
    //questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    questions: [QuestionSchema],
    qrCode: { type: String },
    created_at: { type: Date, default: Date.now },
    candidateToken: { type: String },
    status:{type: String, enum: [  'active', 'expired'], default: "active" }
});

const Quiz = mongoose.model('Quiz', QuizSchema);
//const Question=mongoose.model('Question',QuestionSchema);
module.exports = Quiz;


