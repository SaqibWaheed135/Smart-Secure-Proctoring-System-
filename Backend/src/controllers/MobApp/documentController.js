// const multer = require('multer');
// const path = require('path');
// const Document = require('../../models/MobAppModels/DocumentFile');

// // Configure multer for file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.resolve(__dirname, '../../uploads')); // Folder to store uploaded files
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     // Validate file type
//     const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, and DOCX are allowed.'));
//     }
//   },
// }).single('file'); // Single file upload

// // Upload Document
// const uploadDocument = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ success: false, message: err.message });
//     }

//     try {
      

//       const newDocument = new Document({
//         filePath: req.file.path,
//       });

//       const savedDocument = await newDocument.save();
//       res.status(201).json({ success: true, message: 'File uploaded successfully', data: savedDocument });
//     } catch (error) {
//       res.status(500).json({ success: false, message: 'Server error', error: error.message });
//     }
//   });
// };

// module.exports = { uploadDocument };


const multer = require('multer');
const path = require('path');
const Document = require('../../models/MobAppModels/DocumentFile');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../../uploads')); // Folder to store uploaded files
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
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, and DOCX are allowed.'));
    }
  },
}).single('file'); // Single file upload

// Upload Document
const uploadDocument = async (req, res) => {
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

      // Save document details to the database with candidateId, assessmentId, and token
      const newDocument = new Document({
        userId,
        assessmentId,
        token,
        filePath: req.file.path,
      });

      const savedDocument = await newDocument.save();
      res.status(201).json({ success: true, message: 'File uploaded successfully', data: savedDocument });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  });
};

module.exports = { uploadDocument };
