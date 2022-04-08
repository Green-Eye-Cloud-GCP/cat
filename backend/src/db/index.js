const mongoose = require('mongoose');

require('./models/comprobante');

const mongoConnect = function () {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGODB_URI, function (err) {
            if (err) { return reject(err) }
            resolve()
        });
    })
}

module.exports = {
    mongoConnect
}