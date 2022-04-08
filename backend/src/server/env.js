const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

const config = require('./config');

async function getSecret(client, name) {
    const [response] = await client.accessSecretVersion({
        name: name,
    });

    return response.payload.data.toString('utf8');
}

const init = async function () {
    const client = new SecretManagerServiceClient();

    process.env['JWT_PUBLIC'] = config.JWT_PUBLIC;
    process.env['GREEN_EYE_URL'] = config.GREEN_EYE_URL;
    process.env['CLOUD_BUCKET'] = config.CLOUD_BUCKET;

    process.env['MONGODB_URI'] = config.MONGODB_URI
        ? (await getSecret(client, config.MONGODB_URI)).replace('DATABASE_NAME', config.DB_NAME)
        : ('mongodb://localhost/' + config.DB_NAME);

    process.env['JWT_PRIVATE'] = await getSecret(client, config.JWT_PRIVATE);
}

module.exports = { init }
