const express = require('express');
const multer = require('multer')

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage()
});

const comprobante = require('./controllers/comprobante');
const auth = require('./middleware/auth');

router.post('/nuevo', auth.verifyToken(), upload.single('file'), comprobante.nuevo);

module.exports = router;