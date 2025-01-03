const Candidate = require('../models/Candidate'); 
const Classroom=require('../models/Classroom');// Ensure the model is correctly imported
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const crypto = require('crypto');


// Configure Nodemailer for Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS instead of SSL   
    //service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Replace with your Gmail address
        pass: process.env.EMAIL_PASS, // Replace with your Gmail app password
    },
    logger: true,
    debug: true,
    family: 4,
});


const sendRegistrationEmail = async (req, res) => {
    console.log('Request Body:', req.body); // Add this for debugging

    const { candidates,classroomCode } = req.body;

    if (!candidates || candidates.length === 0) {
        return res.status(400).json({ message: 'No candidates provided!' });
    }

    // if (!classroomCode) {
    //     return res.status(400).json({ message: 'Classroom Code is missing!' });
    // }
    try {
        for (const candidate of candidates) {
            const token = jwt.sign(
                { email: candidate.email, systemId: candidate.systemId },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            console.log(`Sending email with Classroom Code: "3b738c8bd9"`); // Debugging


            const registrationLink = `http://localhost:3000/candidate/classroom/login`;


            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: candidate.email,
                subject: "Complete Your Registration",
                text: `Hi ${candidate.firstName},\n\nYou have been invited to join classroom.\nYour username: ${candidate.email}\nPassword: "nmYlvmxK"\n\nYour Classroom Code:"3b738c8bd9"\n\n Click the link below:\n${registrationLink}\n$\n\nBest regards,\nYour Team`
            };



            await transporter.sendMail(mailOptions);
            console.log(`Registration email sent to ${candidate.email}`);
        }
    } catch (err) {
        console.error("Error sending registration email: ", err);
    }
};


//     console.log('Request Body:', req.body); // Add this for debugging

//     const { candidates } = req.body;

//     if (!candidates || candidates.length === 0) {
//         return res.status(400).json({ message: 'No candidates provided!' });
//     }

//     try {
//         // Use the globally defined transporter
//         for (const candidate of candidates) {
//             const mailOptions = {
//                 from: process.env.EMAIL_USER,
//                 to: candidate.email,
//                 subject: 'Invitation to Register',
//                 text: `Hi ${candidate.firstName} ${candidate.surName},\n\nYou are invited to register. Your username is ${candidate.email} and your password is ${candidate.rawPassword}.\n\nClick the link below:\nhttp://localhost:3000/register\n\nBest regards,\nYour Team`,
//             };

//             await transporter.sendMail(mailOptions);
//             console.log(`Invitation sent to ${candidate.email}`);
//             console.log(`Invitation sent to ${candidate.surName}`);
//             console.log(`Invitation sent to ${JSON.stringify(candidate)}`);
//             console.log(`Sending email to: ${JSON.stringify(req.body.candidates)}`);

//         }

//         res.status(200).json({ message: 'Invitations sent successfully!' });
//     } catch (err) {
//         console.error('Error sending invites:', err);
//         res.status(500).json({ message: 'Failed to send invites.', error: err.message });
//     }
// };
const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};


// Add a new candidate and send registration invitation
const addCandidates = async (req, res) => {
    const { firstName, surName, email, phone, createdAt, systemId, rollNumber } = req.body;
    const randomPassword = generatePassword();
    try {
        const hashedPassword = bcrypt.hashSync(randomPassword, 10);

        // Create a new candidate record
        const candidateData = new Candidate({
            firstName,
            surName,
            email,
            phone,
            createdAt,
            systemId,
            rollNumber,
            password: hashedPassword,
            rawPassword: randomPassword,
            //isRegistered,
            role: 'student',
        });

        await candidateData.save();

        console.log(candidateData.rawPassword);

        // Generate a registration token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

        //Prepare candidate data for the email
        const candidateInfo = {
            firstName,
            surName,
            email,
            rawPassword: randomPassword, // Include rawPassword
        };

        // // Manually construct the req body for the email function
        const mockReq = {
            body: {
                candidates: [candidateInfo],
            },
        };

        // Send invitation email
        await sendRegistrationEmail(mockReq, res);


        res.status(201).json({
            message: 'Candidate added and invitation sent successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json('Error occurred while adding Candidate');
    }
};

// Fetch all candidates
const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find(); // Fetch all candidates from the database
        res.json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json('Error occurred while fetching Candidates');
    }
};

// Delete a candidate
const deleteCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Candidate ID is required' });
        }

        const candidate = await Candidate.findByIdAndDelete(id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error occurred while deleting Candidate' });
    }
};


const CandidateLogin = async (req, res) => {
    try {
        const { email, password, token } = req.body;

        // Check if the token, email, or password is missing
        if (!token || !email || !password) {
            return res.status(400).json({ message: "Email, password, and token are required" });
        }

        // Verify the token before proceeding
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            // Proceed with login logic if the token is valid
            const user = await Candidate.findOne({ email });
            if (!user || user.role !== 'student') {
                return res.status(404).json({ message: "Candidate not found" });
            }

            if (!user.password) {
                console.error("Password not found for user:", user);
                return res.status(500).json({ message: "Server error: Missing password for user" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log("Entered password: ", password);
            console.log("Database stored password: ", user.password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid password" });
            }
            
            // Generate a unique sessiontoken
            const sessionToken = crypto.randomBytes(16).toString('hex');

             // Store the session token for the user in the database (if needed for persistence)
             user.sessionToken = sessionToken;
             await user.save();

            // Generate a new token if the password is valid
            const newToken = jwt.sign(
                { id: user._id, email: user.email, role: "student" },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ message: "Login successful", token: newToken,sessionToken: sessionToken });
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


// Create Classroom
const createClassroom = async (req, res) => {
    try {
        const { instructorId, classroomName } = req.body;

        if (!instructorId || !classroomName) {
            return res.status(400).json({ message: "Instructor ID and Classroom Name are required" });
        }

        // Generate a unique classroom code
        const classroomCode = crypto.randomBytes(5).toString('hex'); // Example: 'a3c9f'

        // Create a new classroom
        const classroom = new Classroom({
            instructorId,
            classroomName,
            classroomCode,
        });

        await classroom.save();

        res.status(201).json({
            message: "Classroom created successfully",
            classroomCode: classroom.classroomCode, // Send the classroom code back to use later

            classroom,
        });
    } catch (error) {
        console.error("Error creating classroom:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Candidate Login with Classroom Code
// const candidateLoginWithClassroom = async (req, res) => {
//     try {
//         const { email, password, classroomCode } = req.body;

//         if (!email || !password || !classroomCode) {
//             return res.status(400).json({ message: "Email, password, and classroom code are required" });
//         }

//         // Check if the classroom code exists
//         const classroom = await Classroom.findOne({ classroomCode });
//         if (!classroom) {
//             return res.status(404).json({ message: "Invalid classroom code" });
//         }

//         // Verify candidate's credentials
//         const candidate = await Candidate.findOne({ email });
//         if (!candidate || candidate.role !== 'student') {
//             return res.status(404).json({ message: "Candidate not found" });
//         }

//         const isPasswordValid = await bcrypt.compare(password, candidate.password);
//         if (!isPasswordValid) {
//             return res.status(400).json({ message: "Invalid password" });
//         }

//         // Store classroom token in local storage (frontend will handle this part)
//         const token = jwt.sign(
//             { id: candidate._id, email: candidate.email, role: "student", classroomCode },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         res.status(200).json({
//             message: "Login successful",
//             token,
//             classroomDetails: classroom,
//         });
//     } catch (error) {
//         console.error("Error during login with classroom code:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

const candidateLoginWithClassroom = async (req, res) => {
    try {
        const { email, password, classroomCode } = req.body;

        // Validate input
        if (!email || !password || !classroomCode) {
            return res.status(400).json({ message: "Email, password, and classroom code are required" });
        }

        // Check if the classroom code exists
        const classroom = await Classroom.findOne({ classroomCode });
        if (!classroom) {
            return res.status(404).json({ message: "Invalid classroom code" });
        }

        // Verify candidate's credentials
        const candidate = await Candidate.findOne({ email });
        if (!candidate || candidate.role !== 'student') {
            return res.status(404).json({ message: "Candidate not found or not a student" });
        }

        const isPasswordValid = await bcrypt.compare(password, candidate.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token with role and classroom code
        const token = jwt.sign(
            { id: candidate._id, email: candidate.email, role: candidate.role, classroomCode },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send success response with token, role, and classroom details
        res.status(200).json({
            message: "Login successful",
            id:candidate._id,
            token,
            role: candidate.role, // Include the role in the response
            email: candidate.email, // Include the email in the response
            classroomDetails: classroom, // Include classroom details
        });
    } catch (error) {
        console.error("Error during login with classroom code:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = { addCandidates, getCandidates, deleteCandidate, CandidateLogin, sendRegistrationEmail, createClassroom,candidateLoginWithClassroom  };
