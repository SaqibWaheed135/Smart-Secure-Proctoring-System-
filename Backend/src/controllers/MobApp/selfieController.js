// const multer = require('multer');
// const path = require('path');
// const Selfies = require('../../models/MobAppModels/UploadSelfie');

// // Configure multer for file storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.resolve(__dirname, '../../uploadSelfie')); // Folder to store uploaded files
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
//         const allowedTypes = ['image/jpeg', 'image/png'];
//         if (allowedTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid type.'));
//         }
//     },
// }).single('file'); // Single file upload

// // Upload Document
// const uploadSelfie = async (req, res) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({ success: false, message: err.message });
//         }

//         try {
//             const { studentId, assessmentId } = req.body;

//             // Validate input fields
//             if (!studentId || !assessmentId) {
//                 return res.status(400).json({ success: false, message: 'Student ID and Assessment ID are required.' });
//             }

//             const newSelfie = new Selfies({
//                 filePath: req.file.path,
//             });

//             const savedDocument = await newSelfie.save();
//             res.status(201).json({ success: true, message: 'File uploaded successfully', data: savedDocument });
//         } catch (error) {
//             res.status(500).json({ success: false, message: 'Server error', error: error.message });
//         }



//     });
// };

// module.exports = { uploadSelfie };


const multer = require('multer');
const path = require('path');
const Selfies = require('../../models/MobAppModels/UploadSelfie');

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../../uploadSelfie')); // Folder to store uploaded files
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
        const allowedTypes = ['image/jpeg', 'image/png','image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'));
        }
    },
}).single('file'); // Single file upload

// Upload Selfie
const uploadSelfie = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }

        try {
            const { userId, assessmentId, token } = req.body;
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file uploaded.' });
            }
            // Check if required parameters are provided
            if (!userId || !assessmentId || !token) {
                return res.status(400).json({ success: false, message: 'Missing candidateId, assessmentId, or token' });
            }

            // // Validate if file is uploaded
            // if (!req.file) {
            //     return res.status(400).json({ success: false, message: 'No file uploaded. Please upload a valid selfie.' });
            // }

            // Save file metadata to database
            const newSelfie = new Selfies({
                userId,
                assessmentId,
                token,
                filePath: req.file.path,

            });

            const savedSelfie = await newSelfie.save();
            res.status(200).json({ success: true, message: 'Selfie uploaded successfully', data: savedSelfie });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    });
};

const getSelfies = async (req, res) => {
    try {
        const { userId, assessmentId } = req.query; // Use query parameters to filter

        // Build the query object dynamically
        const query = {};
        if (userId) query.userId = userId;
        if (assessmentId) query.assessmentId = assessmentId;

        // Fetch selfies from the database
        const selfies = await Selfies.find(query);

        if (selfies.length === 0) {
            return res.status(404).json({ success: false, message: 'No selfies found for the given criteria.' });
        }

        res.status(200).json({ success: true, data: selfies });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



module.exports = { uploadSelfie,getSelfies };   
