const express = require('express');
const logger = require('morgan');

require('./config/index');
require('./models/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const api = require('./api/index');
app.use('/api', api);

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  console.log(err)

  res.send(err.message);
});

module.exports = app;
