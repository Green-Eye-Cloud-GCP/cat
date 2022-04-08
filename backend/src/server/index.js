#!/usr/bin/env node

const env = require('./env');
const db = require('../db/index');
const app = require('../app');
const http = require('http');

const port = process.env.PORT || 3001;
const bind = typeof port === 'string'
  ? 'Pipe ' + port
  : 'Port ' + port;

app.set('port', port);

const server = http.createServer(app);
env.init()
  .then(() => {
    console.log('Environment initialized');

    db.mongoConnect()
      .then(() => {
        console.log('Connected to MongoDB');
        server.listen(port);
        console.log('Listening on ' + bind);
      })
      .catch((err) => {
        throw err;
      })
      
  })
  .catch((err) => {
    throw err;
  })

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

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
