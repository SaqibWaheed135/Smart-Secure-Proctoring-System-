const UserQuiz = require('../models/UserAssessment');
const Quiz = require('../models/Assessment');

const submitQuiz = async (req, res) => {
    const { user_id, quiz_id, answers } = req.body;

    if (!user_id || !quiz_id || !Array.isArray(answers)) {
        return res.status(400).json({
            success: false,
            message: 'User ID, Quiz ID, and answers are required.',
        });
    }

    try {
        const quiz = await Quiz.findById(quiz_id);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found.' });
        }

        // Calculate score
        let score = 0;
        quiz.questions.forEach((question, index) => {
            const userAnswer = answers.find(
                (answer) => answer.question_id.toString() === question._id.toString()
            );
            if (userAnswer && userAnswer.selectedOption === question.correctAnswer) {
                score += 1;
            }
        });

        // Save UserQuiz data
        const userQuiz = new UserQuiz({
            user_id,
            quiz_id,
            answers,
            score,
        });
        await userQuiz.save();

        return res.status(201).json({
            success: true,
            message: 'Quiz submitted successfully.',
            result: { score, totalQuestions: quiz.questions.length },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error occurred while submitting the quiz.',
        });
    }
};

const getUserQuizAttempts = async (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    try {
        const attempts = await UserQuiz.find({ user_id })
            .populate('quiz_id', 'name description')
            .populate('answers.question_id', 'question');
        res.json(attempts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error occurred while fetching quiz attempts.' });
    }
};

module.exports = { submitQuiz, getUserQuizAttempts };
