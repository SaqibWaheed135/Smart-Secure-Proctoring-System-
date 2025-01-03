const mongoose = require('mongoose');

const SelfieSchema = new mongoose.Schema({

  filePath: {
    type: String,
    required: true,
  },
  assessmentId: {
    type: String,
    required: true,  // Ensure the assessment ID is required
  },
  token: {
    type: String,
    required: true,  // Ensure the token is required
  },
  userId: {
    type: String,
    required: true,  // Ensure the user ID is required
  },
  uploadedAt: {
    type: Date,
    default: Date.now, // Automatically record upload time
  },
});

module.exports = mongoose.model('UserSelfies', SelfieSchema);
