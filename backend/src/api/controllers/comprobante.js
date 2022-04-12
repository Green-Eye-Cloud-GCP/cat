const path = require('path');
const mongoose = require('mongoose');
const services = require('../services');

const Comprobante = mongoose.model('Comprobante');

const pageSize = 10;

const newComprobante = async function (req, res, next) {

    if (!req.user.roles.includes('cat.editor')) {
        return res.status(400).json({ 'error': true, 'message': 'Unauthorized request' });
    }

    if (!req.file) {
        return res.status(400).json({ 'error': true, 'message': 'Missing file' });
    }

    const { _id: idUser, org } = req.user;
    const fileName = idUser + '-' + (new Date).getTime().toString() + path.extname(req.file.originalname);
    const { fecha, origenes: idsOrigen, destino: idDestino, cantidad } = req.body;

    try {
        await services.uploadFile(fileName, req.file.buffer)
    } catch (err) {
        return next(err)
    }

    const comprobante = new Comprobante();

    comprobante.org = org;
    comprobante.user = idUser;
    comprobante.fecha = fecha;
    comprobante.origenes = idsOrigen.split(',');
    comprobante.destino = idDestino;
    comprobante.cantidad = cantidad;
    comprobante.archivo = fileName;

    comprobante.save(function (err, doc) {
        if (err) { return next(err) }

        return res.status(200).json({ 'error': false, 'message': 'Done!', 'data': doc });
    });
}

const getComprobantes = function (req, res, next) {

    const { org } = req.user;
    const token = req.token;
    const { page = 1 } = req.query;

    Comprobante.find({ 'org': org })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .select(['fecha', 'user', 'destino', 'cantidad', 'origenes'])
        .lean()
        .exec((err, docs) => {
            if (err) { return next(err) }

            const promises = [];
            docs.forEach((doc, i) => {
                promises.push(services.promesifyRequest('https://www.greeneye.cloud/back/gps/' + doc.destino, token, i, 'destino'));
                promises.push(services.promesifyRequest('https://users-ys4nimzqdq-uc.a.run.app/api/users/' + doc.user, token, i, 'user'));
            })

            Promise.all(promises)
                .then((results) => {
                    results.forEach(([data, i, key]) => {
                        docs[i][key] = data;
                    })

                    return res.status(200).json({ 'error': false, 'message': 'Done!', 'data': docs });
                })
                .catch(err => { return next(err) })
        })
}

const getPageCount = function (req, res, next) {

    const { org } = req.user;

    Comprobante.countDocuments({ 'org': org }).exec((err, count) => {
        if (err) { return next(err) }

        const pageCount = Math.ceil(count / pageSize);

        return res.status(200).json({ 'error': false, 'message': 'Done!', 'data': pageCount });
    })
}

const getComprobante = function (req, res, next) {

    const { org } = req.user;
    const token = req.token;

    Comprobante.findOne({ '_id': req.params.id, 'org': org }).lean().exec((err, doc) => {
        if (err) { return next(err) }

        if (doc) {
            const promises = [];
            doc.origenes.forEach((origen, i) => {
                promises.push(services.promesifyRequest('https://www.greeneye.cloud/back/gps/' + origen, token, i, 'origenes'));
            })
            promises.push(services.promesifyRequest('https://www.greeneye.cloud/back/gps/' + doc.destino, token, null, 'destino'));
            promises.push(services.promesifyRequest('https://users-ys4nimzqdq-uc.a.run.app/api/users/' + doc.user, token, null, 'user'));
            promises.push(services.generateReadSignedUrl(doc.archivo, null, 'archivo'));

            Promise.all(promises)
                .then((results) => {
                    results.forEach(([data, i, key]) => {
                        if (i !== null) {
                            doc[key].splice(i, 1, data);
                        } else {
                            doc[key] = data;
                        }
                    })

                    return res.status(200).json({ 'error': false, 'message': 'Done!', 'data': doc });
                })
                .catch(err => { return next(err) })
        } else {
            return res.status(400).json({ 'error': true, 'message': 'Comprobante not found' });
        }
    })
}

const delComprobante = function (req, res, next) {

    const { org } = req.user;

    Comprobante.findOneAndDelete({ '_id': req.params.id, 'org': org }).exec(async (err, doc) => {
        if (err) { return next(err) }

        if (doc) {
            try {
                await services.deleteFile(doc.archivo);
            } catch (err) {
                return next(err);
            }
            return res.status(200).json({ 'error': false, 'message': 'Done!', 'data': doc });
        } else {
            return res.status(400).json({ 'error': true, 'message': 'Comprobante not found' });
        }
    })
}

const editComprobante = async function (req, res, next) {

    const { _id: idUser, org } = req.user;
    const { fecha, origenes: idsOrigen, destino: idDestino, cantidad } = req.body;

    const query = {}
    if (fecha) {
        query.fecha = fecha;
    }
    if (idsOrigen) {
        query.origenes = idsOrigen.split(',');
    }
    if (idDestino) {
        query.destino = idDestino;
    }
    if (cantidad) {
        query.cantidad = cantidad;
    }
    if (req.file) {
        const fileName = idUser + '-' + (new Date).getTime().toString() + path.extname(req.file.originalname);
        query.archivo = fileName;
        try {
            await services.uploadFile(fileName, req.file.buffer);
        } catch (err) {
            return next(err);
        }
    }

    Comprobante.findOneAndUpdate({ '_id': req.params.id, 'org': org }, { '$set': query }, { 'returnOriginal': false }).exec((err, doc) => {
        if (err) { return next(err) }

        if (doc) {
            return res.status(200).json({ 'error': false, 'message': 'Done!', 'data': doc });
        } else {
            return res.status(400).json({ 'error': true, 'message': 'Comprobante not found' });
        }
    })
}

module.exports = {
    newComprobante,
    getComprobantes,
    getPageCount,
    getComprobante,
    delComprobante,
    editComprobante
};