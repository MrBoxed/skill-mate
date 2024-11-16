const jwt = require('jsonwebtoken');

const ensureAutenticated = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const auth = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer <token>"

    if (!auth) {
        return res.status(401)
            .json({
                message: 'Unauthorized, JWT token is required'
            });
    }

    try {
        const decoded = jwt.verify(auth, process.env.SECRET_TOKEN);
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403)
            .json({
                message: err.message
            });
    }
}

module.exports = ensureAutenticated;