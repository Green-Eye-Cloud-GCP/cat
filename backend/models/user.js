const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	orgs: {
		type: [String],
		enum: [
			'adblick',
			'agropack'
		],
		required: true
	},
	roles: {
		type: [String],
		enum: [
			'cupos.dealer',
			'cupos.receiver',
			'pedido_camiones.'
		],
		required: true
	},
	hash: {
		type: String,
		// select: false
	},
	salt: {
		type: String,
		// select: false
	}
});

schema.methods.setPassword = function (password) {
	/*
	const passRegex = /^((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9!@#$%^&*]{8,24})$/;
	if (!passRegex.test(password)) {
		return false;
	}
	*/

	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');

	return true;
};

schema.methods.validPassword = function (password) {
	const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return this.hash === hash;
};

schema.methods.generateToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			orgs: this.orgs,
			roles: this.roles
		},
		process.env.JWT_PRIVATE,
		{
			expiresIn: '24h',
			algorithm: 'RS256'
		}
	);
};

mongoose.model('User', schema);