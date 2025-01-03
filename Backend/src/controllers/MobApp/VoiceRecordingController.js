const multer = require('multer');
const path = require('path');
const Recording=require('../../models/MobAppModels/UploadVoiceRecording');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../../voiceRecordings')); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Validate file type
        const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg' ,'audio/dot'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid type.'));
        }
    },
}).single('audio'); // Single file upload

// Upload recording
const uploadRecording= async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        try {
            const newRecording = new Recording({
            filePath: req.file.path,
            });

            const savedDocument = await newRecording.save();
            res.status(201).json({ success: true, message: 'Voice Recording file uploaded successfully', data: savedDocument });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }

     });
};

module.exports = { uploadRecording };