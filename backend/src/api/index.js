const express = require('express');

const router = express.Router();

const comprobante = require('./controllers/comprobante');
const auth = require('./middleware/auth');
const formData = require('./middleware/formData');

router.post('/comprobantes', formData, auth.verifyToken, comprobante.newComprobante);
router.get('/comprobantes', auth.verifyToken, comprobante.getComprobantes);
router.get('/comprobantes/pages', auth.verifyToken, comprobante.getPageCount);
router.get('/comprobantes/:id', auth.verifyToken, comprobante.getComprobante);
router.delete('/comprobantes/:id', auth.verifyToken, comprobante.delComprobante);
router.put('/comprobantes/:id', formData, auth.verifyToken, comprobante.editComprobante);

module.exports = router;