

const {verify} = require("jsonwebtoken");

const validateToken = (req, res, next)=>{

    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ error: "User not logged in!" });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Invalid token format!" });
    }
    try {
        const validToken = verify(token, "secrettoken"); 

        if (validToken) {
            req.user = validToken;
            return next(); 
        }
    } catch (err) {
        return res.status(403).json({ error: "Invalid or expired token!" });
    }
};


module.exports = { validateToken};