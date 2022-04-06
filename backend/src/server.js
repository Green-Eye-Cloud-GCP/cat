#!/usr/bin/env node

const config = require('./config/index');
const app = require('./app');
const http = require('http');

const port = process.env.PORT || '3001';

app.set('port', port);

const server = http.createServer(app);
config.init(() => {
  server.listen(port);
  console.log('Listening');
});

server.on('error', (error) => {
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
});

