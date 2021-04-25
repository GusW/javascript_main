const sql = require('mysql2');
const debug = require('debug')('app:lib:db');

// Database
const connection = sql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'library',
  database: 'PSLibrary',
});

connection.connect((err) => {
  if (err) {
    debug(`Error connecting to DB: ${err}`);
    return;
  }
  debug('Connection established');
});

module.exports = connection;
