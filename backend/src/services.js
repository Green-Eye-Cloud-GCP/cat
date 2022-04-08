const jwt = require('jsonwebtoken');

const verifyToken = function (token) {
    const err = new Error('Unauthorized request');
    err.code = 400;

    if (!token) {
        throw err
    }

    const payload = jwt.verify(
        token,
        process.env.JWT_PUBLIC,
        {
            algorithm: 'RS256'
        }
    );

    if (process.env.ROLE_ROOT) {
        const roles = payload.roles.filter(role => role.startsWith(process.env.ROLE_ROOT));

        if (roles.length == 0) {
            throw err
        }
    }

    return payload;
}

module.exports = { verifyToken }