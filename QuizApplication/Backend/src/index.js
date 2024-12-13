const express = require('express');
const dotenv = require('dotenv').config();
const dbConnect=require('./config/DbConnect');
const authRoutes=require('./routes/authRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const candidateRoutes = require('./routes/candidateRoutes');
const assessmentRoutes=require('./routes/assessmentRoutes');
const userAssessmentRoutes=require('./routes/userAssessmentRoutes');

const userRoutes=require('./routes/userRoutes');

dbConnect();
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

app.use(cors()); // Allow all origins (for development)


// Middleware
app.use(express.json());

// Routes
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);

//Candidate Routes

app.use('/api/candidates', candidateRoutes);

//Assessment Routes
app.use('/api/assessments', assessmentRoutes);

//User Assessment Routes

app.use('/api/user-assessments',userAssessmentRoutes);

// Start the Server
const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
