const mongoose = require('mongoose');

const RoomVideoSchema = new mongoose.Schema({
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
  filePath: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now, // Automatically record upload time
  },
});

module.exports = mongoose.model('room-video', RoomVideoSchema);
