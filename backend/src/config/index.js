const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const mongoose = require('mongoose');

const config = require('./config');

async function getMongoDBURI(client) {
    const [response] = await client.accessSecretVersion({
        name: config.MONGODB_URI,
    });

    return response.payload.data.toString('utf8').replace('DATABASE_NAME', 'cat');
}

function mongoConnect(MONGODB_URI) {
    return new Promise((resolve, reject) => {
        mongoose.connect(MONGODB_URI, function (err) {
            if (err) { return reject(err) }
            resolve()
        });
    })
}

const init = async function (callback) {
    const client = new SecretManagerServiceClient();

    process.env['JWT_PUBLIC'] = config.JWT_PUBLIC;
    process.env['GREEN_EYE_URL'] = config.GREEN_EYE_URL;
    process.env['CLOUD_BUCKET'] = config.CLOUD_BUCKET;

    const MONGODB_URI = config.MONGODB_URI ? await getMongoDBURI(client) : 'mongodb://localhost/cat';

    try {
        await mongoConnect(MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        throw (err)
    }

    [response] = await client.accessSecretVersion({
        name: config.JWT_PRIVATE,
    });

    process.env['JWT_PRIVATE'] = response.payload.data.toString('utf8');

    callback();
}

module.exports = { init }
