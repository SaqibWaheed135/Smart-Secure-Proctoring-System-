const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');


const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const register = async (req, res) => {
    try {
        const { firstName, lastName, instituteName, email, password, role } = req.body;

        // Example check for missing required fields
        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            instituteName,
            email,
            password: hashedPassword, // Use hashed password
            role,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log('error', error);
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            console.error("Error during user registration:", error);
            res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    }
};

// const userRegistration = async (req, res) => {
//     const { token, newPassword } = req.body;
//     if (!token) {
//         return res.status(401).json({ message: "Token must be provided" });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("Decoded token:", decoded);

//         const candidate = await User.findOne({ email: decoded.email, systemId: decoded.systemId });

//         if (!candidate) {
//             return res.status(404).json({ message: "Candidate not found" });
//         }

//         if (candidate.isRegistered) {
//             return res.status(400).json({ message: "Candidate is already registered" });
//         }

//         candidate.password = bcrypt.hashSync(newPassword, 10);
//         candidate.isRegistered = true;
//         await candidate.save();

//         const authToken = jwt.sign(
//             { email: candidate.email, role: 'student' },
//             process.env.JWT_SECRET,
//             { expiresIn: '7d' }
//         );

//         res.status(200).json({ message: "Registration successful", token: authToken });
//     } catch (err) {
//         console.error("Error in userRegistration:", err.message);
//         res.status(401).json({ message: "Invalid or expired token" });
//     }
// };


const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: `User with email ${email} not found` });
        }

        if (role && user.role !== role) {
            return res.status(403).json({ message: "Role mismatch. Please log in with the correct role." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Error: ${error.message}` });
    }
};

const googleLogin = async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email } = ticket.getPayload();

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ firstName: name, email, role: 'instructor' });
            await user.save();
        }

        const authToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ token: authToken });
        console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);

    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: 'Something went wrong with Google Login' });
    }
};

const getInstructor = async (req, res) => {
    try {
        const instructors = await User.find({ role: 'instructor' }); // Fetch all instructors from the database
        res.json(instructors);
    } catch (err) {
        console.error(err);
        res.status(500).json('Error occurred while fetching Assessments');
    }
}

const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Instructor ID is required' });
        }

        const instructor = await User.findByIdAndDelete(id);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        res.status(200).json({ message: 'Instructor deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error occurred while deleting Instructor' });
    }
}

module.exports = { register, login, googleLogin, getInstructor, deleteInstructor }