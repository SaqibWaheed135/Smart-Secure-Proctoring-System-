const mongoose = require('mongoose');

// Schema for user's quiz attempt
const UserQuizSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
    quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [
        {
            question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Questions', required: true },
            //question_id: { type: Number, required: true }, // Use the index of the question in the Quiz.questions array

            selectedOption: { type: Number, required: true }, // Index of the selected option
        },
    ],
    score: { type: Number, default: 0 },
    isEvaluated:{type:Boolean,default:false},      
    selfie: { type: String, default: null }, // Path or URL to the uploaded selfie
         
    finalScore:{type:Number,default:null},
    attempted_at: { type: Date, default: Date.now },
    status: { type: String, enum: ['completed', 'incomplete'], default: 'completed' },
});

const UserQuiz = mongoose.model('UserQuiz', UserQuizSchema);
module.exports = UserQuiz;
