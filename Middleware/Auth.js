const jwt = require('jsonwebtoken');
require("dotenv").config();


const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({ message: "Authorization token missing or malformed" });
        }

        const token = authHeader.split(" ")[1];
        // console.log(token, "tokenss");


        // decode 
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.user = decoded;
        // console.log(req.user, "Users");

        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        return res.status(403).send({ message: "Invalid or expired token" });
    }
};


const isAdmin = (req, res, next) => {
    if (req?.user?.role !== 'admin') return res.status(403).send({ message: 'Access Denied' });
    next();
};

module.exports = { verifyToken, isAdmin };