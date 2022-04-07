const path = require('path');
const mongoose = require('mongoose');
const request = require('request');
const { Storage } = require('@google-cloud/storage');

const Comprobante = mongoose.model('Comprobante');
const storage = new Storage();

const nuevo = function (req, res, next) {

    if (!req.user.roles.includes('cat.editor')) {
        return res.status(400).json({ 'error': true, 'message': 'Unauthorized request' });
    }

    const { _id: idUsuario, org } = req.user;

    const fileName = idUsuario + '-' + (new Date).getTime().toString() + path.extname(req.file.originalname);

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

const getComprobantes = function (req, res, next) {

    const { org } = req.user;

    function syncRequest(url) {
        return new Promise((resolve, reject) => {
            request.get({
                url: url,
                json: true
            }, function (err, response, body) {
                if (err) { reject(err) }
                resolve(body);
            })
        })
    }

    Comprobante.find({ 'org': org }, async (err, docs) => {
        if (err) { next(err) }

        for (i = 0; i < docs.length; i++) {
            const doc = docs[i];

            doc.destino = (await syncRequest('http://localhost:3002/back/gps/' + doc.destino)).name;
            //doc.usuario = (await syncRequest('http://localhost:3002/back/user/' + doc.usuario)).user;
        }

        res.status(200).json(docs);
    })
}

module.exports = {
    nuevo,
    getComprobantes
};