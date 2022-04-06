const jwt = require('jsonwebtoken');

const verifyToken = () => {
    return function (req, res, next) {
        const token = jwt.verify(
            req.cookies.token,
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

        req.token = token;
        next();
    }
}

module.exports = {
    verifyToken
};