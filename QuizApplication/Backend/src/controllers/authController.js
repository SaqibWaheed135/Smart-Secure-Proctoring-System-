const User=require('../models/userModel')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);





// const register = async (req, res) => {
//     try {
//         const { username,password,role } = req.body;

//         // Check if the user already exists
//         // const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//         // if (existingUser) {
//         //     return res.status(409).json({ message: "Email or username already exists. Please use a different one." });
//         // }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const newUser = new User({
//             username,
//             password:hashedPassword,
//             role,
            
//         });

//         const savedUser = await newUser.save();
//         res.status(201).json({ message: `User ${username} created successfully`, user: savedUser });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: `Register Error: ${error.message}` });
//     }
// };
// In authController.js

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
        console.log('error',error);
        if (error.code === 11000) {
            // res.status(400).json({ message: 'Email already exists' });
        } else {
            console.error("Error during user registration:", error);
            res.status(500).json({ message: 'Something went wrong', error: error.message });
        }
    }
};



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



module.exports={register,login,googleLogin}