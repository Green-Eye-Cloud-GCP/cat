const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

module.exports.signUp = function (req, res, next) {

    if (!req.headers.secret || req.headers.secret != process.env.ADMIN_SECRET) {
        return res.status(400).json({ 'error': true, 'message': 'Unauthorized request' });
    }

    const { roles, email, orgs, password } = req.body;

    const user = new User();

    user.roles = roles;
    user.email = email;
    user.orgs = orgs;

    const success = user.setPassword(password);

    if (!success) {
        return res.status(400).json({ 'error': true, 'message': 'Invalid password' });
    }

    user.save(function (err) {
        if (err) { return next(err) }

        res.status(200).json({ 'error': false, 'message': 'Done!' });
    });
}

module.exports.logIn = function (req, res, next) {

    const { email, password } = req.body;

    User.findOne({ email: email }, function (err, user) {
        if (err) { return next(err) }

        if (!user) {
            return res.status(400).json({ 'error': true, 'message': 'User not found' });
        }

        if (!user.validPassword(password)) {
            return res.status(400).json({ 'error': true, 'message': 'Wrong password' });
        }

        const token = user.generateToken();

        //res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
        //res.cookie('token', token, { maxAge: 3600000, domain: 'greeneye.cloud' });

        res.status(200).json({ 'error': false, 'message': 'Done!', 'data': { 'token': token } });
    });
}

module.exports.verifyJWT = function (req, res, next) {
    
    try {
        var legit = jwt.verify(
            req.body.token, 
            process.env.JWT_PUBLIC, 
            {
                algorithm: 'RS256'
            }
        );
        res.status(200).json(legit);
    } catch (err) {
        return next(err);
    }
   
}