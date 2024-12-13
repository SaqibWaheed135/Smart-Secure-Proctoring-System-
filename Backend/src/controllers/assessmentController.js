const Quiz = require('../models/Assessment');

const createAssessment = async (req, res) => {
    const { name, description, start_date, end_date, questions } = req.body;

    // Validate required fields
    if (!name || !description || !start_date || !end_date) {
        return res.status(400).json({
            success: false,
            message: 'Name, description, start_date, and end_date are required fields.',
        });
    }

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Questions array is required and must not be empty.',
        });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        if (
            !question.question ||
            !Array.isArray(question.options) ||
            question.options.length < 2 ||
            question.correctAnswer === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: `Question ${i + 1} is not valid. Each question must have a question, options (at least two), and a correctAnswer.`,
            });
        }
    }

    try {
        // Create a new Quiz/Assessment object
        const quizData = new Quiz({
            name,
            description,
            start_date,
            end_date,
            questions,
            created_at: new Date(),
        });

        // Save to the database
        await quizData.save();

        return res.status(201).json({
            success: true,
            message: 'Assessment created successfully.',
            record: quizData,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error occurred while creating Assessment.',
        });
    }
};

const getAssessment= async (req, res) => {
    try {
        const assessments= await Quiz.find(); // Fetch all candidates from the database
        res.json(assessments);
    } catch (err) {
        console.error(err);
        res.status(500).json('Error occurred while fetching Assessments');
    }
}

const deleteAssessment=async(req,res)=>{
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Assessment ID is required' });
        }

        const assessment = await Quiz.findByIdAndDelete(id);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        res.status(200).json({ message: 'Assessment deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error occurred while deleting Assessment' });
    }
}


module.exports = { createAssessment, getAssessment , deleteAssessment};
