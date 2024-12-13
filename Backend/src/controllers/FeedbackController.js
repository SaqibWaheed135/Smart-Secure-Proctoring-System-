const Feedback = require('../models/Feedback');

const getFeedback = async (req, res) => {

    try {
        const FeedbackList = await Feedback.find();
        res.status(200).json("Feedback fetched successfully", FeedbackList);
    } catch (err) {
        console.error(err);
        res.status(500).json('Error occurred while fetching Feedback');
    }
};

const addFeedback = async (req, res) => {
    const {userName, feedbackText}= req.body;
    if (!userName || !feedbackText) {
        return res.status(400).json({ error: 'Both userName and feedbackText are required' });
    }
    try {
        const newfeedBack = new Feedback({userName, feedbackText});
        await newfeedBack.save();
        res.status(201).json({message:'Feedback submitted successfully', feedback:newfeedBack});
    }
    catch {
        console.error(err);
        res.status(500).json('Error occurred while adding Feedback');
    }
};

module.exports = { getFeedback, addFeedback };
