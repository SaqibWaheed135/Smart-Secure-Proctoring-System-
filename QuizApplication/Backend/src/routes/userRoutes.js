const express = require('express')
const verifyToken = require('../middlewares/authMiddleware')
const authorizeRoles = require('../middlewares/roleMiddleware')
const router = express.Router();

//Only Admin Can access this router

router.get('/admin', verifyToken, authorizeRoles('admin'), (req, res) => {
    res.send({ message: 'Welcome Admin' });
});

// Both Admin and Instructor can access this router

router.get('/instructor', verifyToken, authorizeRoles('instructor', 'admin'), (req, res) => {
    res.send({ message: 'Welcome Instructor' });
});

// All can access this router

router.get('/user', verifyToken, authorizeRoles('user', 'admin', 'instructor'), (req, res) => {
    res.send({ message: 'Welcome User' });
});

module.exports = router