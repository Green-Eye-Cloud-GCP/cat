const axios = require('axios');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

const promesifyRequest = function (url, token, i, key) {
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

const generateReadSignedUrl = function (fileName, i, key) {
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

module.exports = {
    storage,
    promesifyRequest,
    generateReadSignedUrl
}