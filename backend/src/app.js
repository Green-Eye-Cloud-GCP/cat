const path = require('path');
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

require('./models/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const api = require('./api/index');
app.use('/api', api);

const handler = express.static(path.join(__dirname, 'public'));
app.use(function (req, res, next) {
  if (req.cookies.token) {

    const payload = jwt.verify(
      req.cookies.token,
      process.env.JWT_PUBLIC,
      {
        algorithm: 'RS256'
      }
    );
      
    const roles = payload.roles.filter(role => role.startsWith('cat.'));

    if (roles.length > 0) {
      return handler(req, res, next);
    }
  }
  res.redirect(process.env.GREEN_EYE_URL);
});

app.use(function (err, req, res, next) {
  console.log(err)
  res.status(err.status || 500).json({ 'error': true, 'message': err.message });
});

module.exports = app;
