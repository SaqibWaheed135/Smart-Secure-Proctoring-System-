const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    let token;
    let authheader = req.headers.Authorization || req.headers.authorization;

    if (authheader && authheader.startsWith('Bearer ')) {
        token = authheader.split(' ')[1];
    

    if (!token) {
        return res.status(401).json({ message: 'No token ,Unauthorized User' });
    }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
            if (decode.role !== 'student') {
                return res.status(403).json({ message: 'Forbidden: Access restricted to students' });
            }
            console.log("The decoded user is :", req.user);
            next(); // Allow the request to proceed

        }
        catch (error) {
            res.status(400).json({ message: 'Token is not valid' });
        }
    }

    else{
        return res.status(401).json({ message: 'No token ,Unauthorized User' });
    }
    
}

module.exports = verifyToken; // Export the verifyToken;
