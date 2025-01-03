const mongoose = require('mongoose');

const RecordingSchema = new mongoose.Schema({
  filePath: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('voice-recordings', RecordingSchema);

// const mongoose = require('mongoose');

// const VoiceSchema = new mongoose.Schema({
//     filename: {
//         type: String,
//         required: true,
//     },
//     path: {
//         type: String,
//         required: true,
//     },
//     duration: {
//         type: String,
//         required: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// module.exports = mongoose.model('Voice', VoiceSchema);

