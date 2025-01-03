// const express = require('express');
// const router = express.Router();
// const {uploadRecording}=require('../controllers/MobApp/voicerecordingController');

// // POST request for file upload
// router.post('/upload', uploadRecording);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {uploadRecording}=require('../controllers/MobApp/VoiceRecordingController')

// Routes
router.post('/upload', uploadRecording);
// router.get('/', voiceController.getVoices);
// router.delete('/:id', voiceController.deleteVoice);

module.exports = router;
    