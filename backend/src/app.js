const path = require('path');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const services = require('./services');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const api = require('./api/index');
app.use('/api', api);

const handler = express.static(path.join(__dirname, 'public'));
app.use(function (req, res, next) {
  try {
    services.verifyToken(req.cookies.token);
    return handler(req, res, next);
  } catch (err) {
    console.log(err)
    return res.redirect('/');
  }
});

app.use(function (err, req, res, next) {
  console.error(err)
  return res.status(err.status || 500).json({ 'error': true, 'message': err.message });
});

module.exports = app;

//TODO: elimianar token
//TODO: Cannot GET /view/6253848439369a532a751902
//TODO: eliminar console.log
