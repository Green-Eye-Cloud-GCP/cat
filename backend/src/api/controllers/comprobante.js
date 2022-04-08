const path = require('path');
const mongoose = require('mongoose');
const services = require('../services');

const Comprobante = mongoose.model('Comprobante');

const newComprobante = function (req, res, next) {

    if (!req.user.roles.includes('cat.editor')) {
        return res.status(400).json({ 'error': true, 'message': 'Unauthorized request' });
    }

    const { _id: idUser, org } = req.user;

    const fileName = idUser + '-' + (new Date).getTime().toString() + path.extname(req.file.originalname);

    const bucket = services.storage.bucket(process.env.CLOUD_BUCKET);
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
        next(err);
    });

    blobStream.on('finish', () => {

        const { fecha, origenes: idsOrigen, destino: idDestino, cantidad } = req.body;

        const comprobante = new Comprobante();

        comprobante.org = org;
        comprobante.user = idUser;
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

    Comprobante.find({ 'org': org }).lean().exec((err, docs) => { //TODO: select
        if (err) { next(err) }

        const promises = [];
        docs.forEach((doc, i) => {
            promises.push(services.promesifyRequest('http://localhost:3002/back/gps/' + doc.destino, req.token, i, 'destino'));
            promises.push(services.promesifyRequest('https://users-ys4nimzqdq-uc.a.run.app/api/users/' + doc.user, req.token, i, 'user'));
            promises.push(services.generateReadSignedUrl(doc.archivo, i, 'archivo'));
        })

        Promise.all(promises)
            .then((results) => {
                results.forEach(([data, i, key]) => {
                    docs[i][key] = data;
                })

                res.status(200).json(docs);
            })
            .catch(err => next(err))

    })
}

module.exports = {
    newComprobante,
    getComprobantes
};