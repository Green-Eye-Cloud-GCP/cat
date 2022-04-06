const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	org: {
		type: String,
		required: true
	},
	usuario: {
		type: String,
		required: true
	},
	fecha: {
		type: Date,
		required: true
	},
	origen: {
		type: String,
		required: true
	},
	destino: {
		type: String,
		required: true
	},
	cantidad: {
		type: Number,
		required: true
	},
	archivo: {
		type: String,
		required: true
	}
});

mongoose.model('Comprobante', schema);