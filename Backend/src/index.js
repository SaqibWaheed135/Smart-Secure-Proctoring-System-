const express = require('express');
const dotenv = require('dotenv').config();
const dbConnect = require('./config/DbConnect');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const cors = require('cors');
const candidateRoutes = require('./routes/candidateRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const userAssessmentRoutes = require('./routes/userAssessmentRoutes');
const FeedbackRoutes = require('./routes/FeedbackRoutes')
const QrCodeRoute = require('./routes/QrCodeRoutes')
//const setupWebSocketServer = require('./websocket/websocketServer');
const documentRoutes = require('./routes/MobAppUploadDocumentRoutes');
const selfieRoutes = require('./routes/MobAppUploadSelfieRoutes');
const RecordingRoutes = require('./routes/MobAppVoiceRecordingRoutes');
const roomRecordingRoutes = require('./routes/MobAppRoomVideoRoutes');
const setupWebSocketServer = require('./websocket/websocketServer');

const userRoutes = require('./routes/userRoutes');

dbConnect();
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

app.use(cors()); // Allow all origins (for development)


// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

//Candidate Routes

app.use('/api/candidates', candidateRoutes);

//Assessment Routes
app.use('/api/assessments', assessmentRoutes);

//User Assessment Routes

app.use('/api/user-assessments', userAssessmentRoutes);

//Feedback Routes

app.use('/api/feedback', FeedbackRoutes)

//Qr Code Routes

app.use('/api/generate-qr-code', QrCodeRoute)

//Web sockets

//Create an http server

// const server = http.createServer(app);

// setupWebSocketServer(server);

//Mob App Routes

app.use('/api/upload-document', documentRoutes);

app.use('/api/upload-selfie', selfieRoutes);

app.use('/api/voice-recording', RecordingRoutes)

app.use('/api/room-recording', roomRecordingRoutes);

// Create an HTTP server

const server = http.createServer(app);
setupWebSocketServer(server);

//Start the Server
const PORT = process.env.PORT || 4002;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});