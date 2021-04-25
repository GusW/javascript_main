const { MongoClient } = require('mongodb');
const debug = require('debug')('app:mongoConn');

const url = 'mongodb://localhost:27017';
const dbName = 'libraryApp';
const usersCollectionName = 'users';
const bookCollectionName = 'books';

const mongoConn = async () => {
  let db;
  let client;
  try {
    client = await MongoClient.connect(url);
    debug('Connected to mongodb');
    db = client.db(dbName);
  } catch (err) {
    debug(err.stack);
  }
  return { client, db };
};

const bookCollection = async () => {
  let collection;
  let dbClient;
  try {
    const { client, db } = await mongoConn();
    collection = db.collection(bookCollectionName);
    dbClient = client;
  } catch (err) {
    debug(err.stack);
  }
  return { dbClient, collection };
};

const userCollection = async () => {
  let collection;
  let dbClient;
  try {
    const { client, db } = await mongoConn();
    collection = db.collection(usersCollectionName);
    dbClient = client;
  } catch (err) {
    debug(err.stack);
  }
  return { dbClient, collection };
};

module.exports = { mongoConn, bookCollection, userCollection };
