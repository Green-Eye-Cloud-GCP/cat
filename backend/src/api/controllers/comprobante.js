const mongoose = require('mongoose');
const Comprobante = mongoose.model('Comprobante');
const jwt = require('jsonwebtoken');

const nuevo = function (req, res, next) {

    const legit = jwt.verify(
        req.cookies.token,
        process.env.JWT_PUBLIC,
        {
            algorithm: 'RS256'
        }
    );
    /*
    if (!legit.roles.includes('cat.editor')) {
        return res.status(400).json({ 'error': true, 'message': 'Unauthorized request' });
    }*/

    console.log(req.file);

    res.status(200).json({ 'error': false, 'message': 'Done!' });

    /*
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
    */
}

module.exports = {
    nuevo
};