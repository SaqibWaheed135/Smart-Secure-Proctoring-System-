// const multer = require('multer');
// const path = require('path');
// const RoomVideo = require('../../models/MobAppModels/RoomVideo');

// // Configure multer for file storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.resolve(__dirname, '../../roomVideos')); // Folder to store uploaded files
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = `${Date.now()}-${file.originalname}`;
//         cb(null, uniqueName);
//     },
// });

// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         // Validate file type
//         const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
//         if (allowedTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid file type. '));
//         }
//     },
// }).single('video'); // Single file upload

// // Upload Document
// const uploadRoomVideo = async (req, res) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({ success: false, message: err.message });
//         }

//         try {

//             const newRoomVideo = new RoomVideo({
//                 filePath: req.file.path,
//             });

//             const savedDocument = await newRoomVideo.save();
//             res.status(200).json({ success: true, message: 'Video uploaded successfully', data: savedDocument });
//         } catch (error) {
//             res.status(500).json({ success: false, message: 'Server error', error: error.message });
//         }
//     });
// };

// module.exports = { uploadRoomVideo };


const multer = require('multer');
const path = require('path');
const RoomVideo = require('../../models/MobAppModels/RoomVideo');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../../roomVideos')); // Folder to store uploaded files
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
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only MP4, WebM, OGG, and QuickTime videos are allowed.'));
        }
    },
}).single('video'); // Single file upload

// Upload Room Video
const uploadRoomVideo = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        try {
            // Extract the candidateId (or userId), assessmentId, and token from the request
            const { userId, assessmentId, token } = req.body;  // Change to 'userId' if needed

            // Check if required parameters are provided
            if (!userId || !assessmentId || !token) {
                return res.status(400).json({ success: false, message: 'Missing candidateId, assessmentId, or token' });
            }

            // Validate if file is uploaded
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No video uploaded. Please upload a valid video file.' });
            }

            // Save the file and metadata in the database
            const newRoomVideo = new RoomVideo({
                userId,
                assessmentId,
                token,
                filePath: req.file.path,
                fileName: req.file.filename,
                fileType: req.file.mimetype,
            });

            const savedRoomVideo = await newRoomVideo.save();
            res.status(200).json({ success: true, message: 'Video uploaded successfully', data: savedRoomVideo });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    });
};

module.exports = { uploadRoomVideo };

