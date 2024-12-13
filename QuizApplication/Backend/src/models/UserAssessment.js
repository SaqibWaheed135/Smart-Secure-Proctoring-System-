const mongoose = require('mongoose');

// Schema for user's quiz attempt
const UserQuizSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [
        {
            question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz.questions', required: true },
            selectedOption: { type: Number, required: true }, // Index of the selected option
        },
    ],
    score: { type: Number, default: 0 },
    attempted_at: { type: Date, default: Date.now },
    status: { type: String, enum: ['completed', 'incomplete'], default: 'completed' },
});

const UserQuiz = mongoose.model('UserQuiz', UserQuizSchema);
module.exports = UserQuiz;
