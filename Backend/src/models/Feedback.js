const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  feedbackText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
