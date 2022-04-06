const jwt = require('jsonwebtoken');

const verifyToken = function (req, res, next) {
    const payload = jwt.verify(
        req.cookies.token || req.body.token,
        process.env.JWT_PUBLIC,
        {
            algorithm: 'RS256'
        }
    );

    /*
    const roles = token.roles.filter(role => role.startsWith('cat.'))

    if (roles.length == 0) {
        return res.status(400).json({ 'error': true, 'message': 'Unauthorized request' });
    }
    */

    req.user = payload;
    next();
}

module.exports = {
    verifyToken
};