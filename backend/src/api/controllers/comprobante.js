const path = require('path');
const mongoose = require('mongoose');
const axios = require('axios');
const { Storage } = require('@google-cloud/storage');

const Comprobante = mongoose.model('Comprobante');
const storage = new Storage();

const newComprobante = function (req, res, next) {

    if (!req.user.roles.includes('cat.editor')) {
        return res.status(400).json({ 'error': true, 'message': 'Unauthorized request' });
    }

    const { _id: idUser, org } = req.user;

    const fileName = idUser + '-' + (new Date).getTime().toString() + path.extname(req.file.originalname);

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

    function promesifyRequest(url, token, i, key) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params: {
                    token: token
                }
            })
                .then(function (response) {
                    resolve([response.data.data ? response.data.data : response.data, i, key]);
                })
                .catch(function (error) {
                    reject(error);
                })
        })
    }

    function generateReadSignedUrl(fileName, i, key) {
        return new Promise((resolve, reject) => {
            const options = {
                version: 'v4',
                action: 'read',
                expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            };

            const bucket = storage.bucket(process.env.CLOUD_BUCKET);
            const blob = bucket.file(fileName);
            blob.getSignedUrl(options)
                .then(function (response) {
                    resolve([response, i, key]);
                })
                .catch(function (error) {
                    reject(error);
                })
        })
    }

    Comprobante.find({ 'org': org }).lean().exec((err, docs) => {
        if (err) { next(err) }

        const promises = [];
        docs.forEach((doc, i) => {
            promises.push(promesifyRequest('http://localhost:3002/back/gps/' + doc.destino, req.token, i, 'destino'));
            promises.push(promesifyRequest('https://users-ys4nimzqdq-uc.a.run.app/api/users/' + doc.user, req.token, i, 'user'));
            promises.push(generateReadSignedUrl(doc.archivo, i, 'archivo'));
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