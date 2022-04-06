const mongoose = require('mongoose');
const Comprobante = mongoose.model('Comprobante');
const jwt = require('jsonwebtoken');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

const nuevo = function (req, res, next) {

    /*
    if (!req.token.roles.includes('cat.editor')) {
        return res.status(400).json({ 'error': true, 'message': 'Unauthorized request' });
    }*/

    const comprobante = new Comprobante();

    const fileExtension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
    const fileName = req.token._id + '-' + (new Date).getTime().toString() + fileExtension;

    const bucket = storage.bucket(process.env.CLOUD_BUCKET);
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
        next(err);
    });

    blobStream.on('finish', () => {
        res.status(200).json({ 'error': false, 'message': 'Done!' });
    });

    blobStream.end(req.file.buffer);

    console.log(req.token);
    console.log(req.file);



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