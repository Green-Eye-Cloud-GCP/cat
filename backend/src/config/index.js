const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const mongoose = require('mongoose');

const config = require('./config');

async function getMongoDBURI(client) {
    const [response] = await client.accessSecretVersion({
        name: config.MONGODB_URI,
    });
    
    return response.payload.data.toString('utf8').replace('DATABASE_NAME', 'cat');
}

module.exports.init = async function (callback) {
    const client = new SecretManagerServiceClient();

    process.env['JWT_PUBLIC'] = config.JWT_PUBLIC;
    process.env['GREEN_EYE_URL'] = config.GREEN_EYE_URL;

    const MONGODB_URI =  config.MONGODB_URI ? await getMongoDBURI(client) : 'mongodb://localhost/cat';

    mongoose.connect(MONGODB_URI, function (err) {
        if (err) { throw (err) }
        return console.log('Connected to MongoDB')
    });

    var [response] = await client.accessSecretVersion({
        name: config.ADMIN_SECRET,
    });

    process.env['ADMIN_SECRET'] = response.payload.data.toString('utf8');

    [response] = await client.accessSecretVersion({
        name: config.JWT_PRIVATE,
    });

    process.env['JWT_PRIVATE'] = response.payload.data.toString('utf8');

    callback();
}
