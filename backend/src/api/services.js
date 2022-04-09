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
            .catch(function (err) {
                reject(err);
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
                const data = {
                    'url': response[0],
                    'fileName': fileName
                }
                resolve([data, i, key]);
            })
            .catch(function (err) {
                reject(err);
            })
    })
}

const uploadFile = function (fileName, buffer) {
    return new Promise((resolve, reject) => {

        const bucket = storage.bucket(process.env.CLOUD_BUCKET);
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (err) => {
            return reject(err);
        });

        blobStream.on('finish', () => { 
            return resolve()
        })

        blobStream.end(buffer);
    })
}

module.exports = {
    promesifyRequest,
    generateReadSignedUrl,
    uploadFile
}