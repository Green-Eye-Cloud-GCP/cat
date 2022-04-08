const services = require('../../services');

const verifyToken = function (req, res, next) {
    try {
        const token = req.cookies.token || req.headers.token || req.body.token || req.query.token;

        req.user = services.verifyToken(token);

        req.token = token;
        next();

    } catch (err) {
        return next(err);
    }
}

module.exports = {
    verifyToken
};