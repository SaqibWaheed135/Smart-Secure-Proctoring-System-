const express = require('express')
const { register, login, googleLogin, getInstructor, deleteInstructor } = require('../controllers/authController')
const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/google-login', googleLogin);

router.get('/get-instructor', getInstructor);

router.delete('/delete-instructor/:id', deleteInstructor);



module.exports = router;
