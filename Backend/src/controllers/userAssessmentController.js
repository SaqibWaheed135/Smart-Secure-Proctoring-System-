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
            isEvaluated: false,
        });
        await userQuiz.save();

        return res.status(201).json({
            success: true,
            message: 'Quiz submitted successfully.Waiting for evaluation.',
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

// const getUserQuizAttempts = async (req, res) => {
//     const { user_id } = req.params;

//     if (!user_id) {
//         return res.status(400).json({ success: false, message: 'User ID is required.' });
//     }

//     try {
//         const attempts = await UserQuiz.find({ user_id })
//             .populate('quiz_id', 'name description')
//             .populate('answers.question_id', 'question');
//         res.json(attempts);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: 'Error occurred while fetching quiz attempts.' });
//     }
// };

const getQuizAttempts = async (req, res) => {
    const { quiz_id } = req.params;

    if (!quiz_id) {
        return res.status(400).json({ success: false, message: 'Quiz ID is required.' });
    }

    try {
        // Fetch all attempts for the specific quiz
        const attempts = await UserQuiz.find({ quiz_id })
            .populate('quiz_id', 'name description questions')
            .populate('user_id', 'firstName surName')
            .exec();

        res.status(200).json({
            success: true,
            attempts,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching quiz attempts.' });
    }
};

const getQuizAnswers = async (req, res) => {
    const { user_id, quiz_id } = req.params;

    if (!user_id || !quiz_id) {
        return res.status(400).json({
            success: false,
            message: 'User ID and Quiz ID are required.',
        });
    }

    try {
        // Find the user's quiz attempt
        const userQuiz = await UserQuiz.findOne({ user_id, quiz_id })
            .populate('answers.question_id', 'name'); // Populate question details
        if (!userQuiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz attempt not found.',
            });
        }

        // Return only the answers
        const answers = userQuiz.answers.map(answer => ({
            question: answer.question_id.name,
            answer: answer.answer,
        }));

        res.status(200).json({
            success: true,
            answers,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error occurred while fetching answers.',
        });
    }
};



const evaluateQuiz = async (req, res) => {
    const { user_id, quiz_id, evaluation, answers } = req.body; // evaluation will contain the score and any feedback

    if (!user_id || !quiz_id || !evaluation || typeof evaluation.score !== 'number' || !Array.isArray(answers)) {
        return res.status(400).json({ success: false, message: 'Invalid evaluation data.' });
    }

    try {
        // Find the quiz attempt
        const userQuiz = await UserQuiz.findOne({ user_id, quiz_id, isEvaluated: false });
        if (!userQuiz) {
            return res.status(404).json({ success: false, message: 'Quiz attempt not found or already evaluated.' });
        }

        userQuiz.answers = answers; // store the user's answers
        console.log(userQuiz.answers);
        // Evaluate the quiz answers (custom logic for evaluating can be added here)
        userQuiz.isEvaluated = true;
        userQuiz.finalScore = evaluation.score; // set the final score
        userQuiz.feedback = evaluation.feedback || ''; // optional feedback

        await userQuiz.save();

        return res.status(200).json({
            success: true,
            message: 'Quiz evaluated successfully.',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error occurred while evaluating the quiz.' });
    }
};

// In your userAssessmentController.js

const getEvaluationReport = async (req, res) => {
    const { user_id, quiz_id } = req.params;

    if (!user_id || !quiz_id) {
        return res.status(400).json({
            success: false,
            message: 'User ID and Quiz ID are required.',
        });
    }

    try {
        // Fetch the user's quiz attempt along with the evaluation data
        const userQuiz = await UserQuiz.findOne({ user_id, quiz_id })
            .populate('quiz_id', 'name description')
            .populate('answers.question_id', 'question')
            .exec();

        if (!userQuiz) {
            return res.status(404).json({ success: false, message: 'Quiz attempt not found.' });
        }

        // You can include additional information like the instructor's evaluation or feedback
        const evaluationReport = {
            score: userQuiz.score,
            answers: userQuiz.answers,
            // Add any additional feedback from instructor here if applicable
        };

        res.status(200).json({
            success: true,
            evaluationReport,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching evaluation report.' });
    }
};

module.exports = { submitQuiz, evaluateQuiz, getEvaluationReport, getQuizAttempts,getQuizAnswers };
