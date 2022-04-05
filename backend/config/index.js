const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const mongoose = require('mongoose');

const config = require('./config');

module.exports.init = async function () {
    const client = new SecretManagerServiceClient();

    process.env['JWT_PUBLIC'] = config.JWT_PUBLIC;

    var [response] = await client.accessSecretVersion({
        name: config.MONGODB_URI,
    });

    process.env['MONGODB_URI'] = response.payload.data.toString('utf8').replace('DATABASE_NAME', 'users');

    mongoose.connect(process.env.MONGODB_URI, function (err) {
        if (err) { throw (err) }

        return console.log('Connected to MongoDB')
    });

    [response] = await client.accessSecretVersion({
        name: config.ADMIN_SECRET,
    });

    process.env['ADMIN_SECRET'] = response.payload.data.toString('utf8');

    [response] = await client.accessSecretVersion({
        name: config.JWT_PRIVATE,
    });

    process.env['JWT_PRIVATE'] = response.payload.data.toString('utf8');
}

