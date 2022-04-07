const mongoose = require('mongoose');
const Comprobante = mongoose.model('Comprobante');
const jwt = require('jsonwebtoken');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

const nuevo = function (req, res, next) {

    if (!req.user.roles.includes('cat.editor')) {
        return res.status(400).json({ 'error': true, 'message': 'Unauthorized request' });
    }

    const { _id: idUsuario, org } = req.user;

    console.log(req.user);
    console.log(req.file);


    const fileExtension = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
    const fileName = idUsuario + '-' + (new Date).getTime().toString() + fileExtension;

    const bucket = storage.bucket(process.env.CLOUD_BUCKET);
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
        next(err);
    });

    blobStream.on('finish', () => {

        const { fecha, origenes: idsOrigen, destino: idDestino, cantidad } = req.body;

        const comprobante = new Comprobante();

        comprobante.org = org;
        comprobante.usuario = idUsuario;
        comprobante.fecha = fecha;
        comprobante.origenes = idsOrigen;
        comprobante.destino = idDestino;
        comprobante.cantidad = cantidad;
        comprobante.archivo = fileName;

        comprobante.save(function (err) {
            if (err) { return next(err) }
    
            res.status(200).json({ 'error': false, 'message': 'Done!' });
        });
    });

    blobStream.end(req.file.buffer);
}

module.exports = {
    nuevo
};