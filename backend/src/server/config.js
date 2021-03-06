const MONGODB_URI = process.env.NODE_ENV === 'development' ? undefined : 'projects/214203301889/secrets/MONGODB_URI/versions/1';
const JWT_PRIVATE = 'projects/214203301889/secrets/JWT_PRIVATE/versions/2';
const JWT_PUBLIC = '-----BEGIN PUBLIC KEY-----\nMFswDQYJKoZIhvcNAQEBBQADSgAwRwJAZvt/mMOXuvBvz8FCHcgdM5CUKrix+u53\nhrGQZNpI+2gun8fE7Muk1kvErIbjOS6mDIWlmMaa5IckNVltExqu2wIDAQAB\n-----END PUBLIC KEY-----';
const GREEN_EYE_URL = 'https://www.greeneye.cloud';
const CLOUD_BUCKET = 'archivos-cat';
const DB_NAME = 'cat';
const ROLE_ROOT = 'cat.';

module.exports = {
    MONGODB_URI,
    JWT_PRIVATE,
    JWT_PUBLIC,
    GREEN_EYE_URL,
    CLOUD_BUCKET,
    DB_NAME,
    ROLE_ROOT
};