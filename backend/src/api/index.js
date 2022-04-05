const express = require('express');
const router = express.Router();
const comprobante = require('./controllers/comprobante')
const multer = require('multer')
const upload = multer({
    storage: multer.memoryStorage()
});

router.post('/nuevo', upload.single('file'), comprobante.nuevo);

module.exports = router;