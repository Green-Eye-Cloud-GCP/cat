const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	org: {
		type: String,
		required: true
	},
	user: { 				// id de usuario
		type: String,
		required: true
	},
	fecha: {
		type: Date,
		required: true
	},
	origenes: [{ 			// ids de origen
		type: String,
		required: true
	}],
	destino: {				// id de destino
		type: String,
		required: true
	},
	cantidad: {
		type: Number,
		required: true
	},
	archivo: {				// nombre de archivo en bucket
		type: String,
		required: true
	}
});

mongoose.model('Comprobante', schema);