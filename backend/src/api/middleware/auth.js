const jwt = require('jsonwebtoken');

const verifyToken = function (req, res, next) {
    try {
        const token = req.cookies.token || req.body.token || req.query.token;

        const payload = jwt.verify(
            token,
            process.env.JWT_PUBLIC,
            {
                algorithm: 'RS256'
            }
        );

        const roles = payload.roles.filter(role => role.startsWith('cat.'));

        if (roles.length == 0) {
            return res.status(400).json({ 'error': true, 'message': 'Unauthorized request' });
        }

        req.user = payload;
        req.token = token;
        next();

    } catch (err) {
        next(err);
    }
}

module.exports = {
    verifyToken
};