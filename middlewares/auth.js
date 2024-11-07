const jwt = require('jsonwebtoken');

const ensureAutenticated = (req, res, next) => {

    const auth = req.header['authorization'];
    if (!auth) {
        return res.status(403)
            .json({
                message: 'Unauthorized, JWT token is require'
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
                message: 'Unauthorized, JWT token is require'
            });
    }
}

module.exports = ensureAutenticated;