#!/usr/bin/env node

const app = require('./app');
const http = require('http');

const port = process.env.PORT || '3000';

app.set('port', port);

const server = http.createServer(app);

(async function () {
  const config = require('./config/index');
  await config.init();
  server.listen(port);
})();

server.on('error', onError);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

