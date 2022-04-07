const express = require('express');

const router = express.Router();

const comprobante = require('./controllers/comprobante');
const auth = require('./middleware/auth');
const formData = require('./middleware/formData');

router.post('/comprobantes/nuevo', formData, auth.verifyToken, comprobante.nuevo);
router.get('/comprobantes', auth.verifyToken, comprobante.getComprobantes);

module.exports = router;