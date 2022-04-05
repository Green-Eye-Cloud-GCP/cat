const express = require('express');
const router = express.Router();
const comprobante = require('./controllers/comprobante')

router.post('/nuevo', comprobante.nuevo);

module.exports = router;