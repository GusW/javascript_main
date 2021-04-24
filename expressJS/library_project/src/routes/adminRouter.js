const express = require('express');
const debug = require('debug')('app:adminRouter');
const { MongoClient, ObjectID } = require('mongodb');

const adminRouter = express.Router();

const booksToInsert = [
  {
    title: 'War and Peace',
    genre: 'Historical Fiction',
    author: 'Lev Nikolayevich Tolstoy',
    read: false,
  },
  {
    title: 'Les Miserables',
    genre: 'Historical Fiction',
    author: 'Victor Hugo',
    read: false,
  },
  {
    title: 'The Time Machine',
    genre: 'Science Fiction',
    author: 'H. G. Wells',
    read: false,
  },
  {
    title: 'A Journey into the Center of the Earth',
    genre: 'Science Fiction',
    author: 'Jules Verne',
    read: false,
  },
  {
    title: 'The Dark World',
    genre: 'Fantasy',
    author: 'Henry Kuttner',
    read: false,
  },
  {
    title: 'The Wind in the Willows',
    genre: 'Fantasy',
    author: 'Kenneth Grahame',
    read: false,
  },
  {
    title: 'Life On The Mississippi',
    genre: 'History',
    author: 'Mark Twain',
    read: false,
  },
  {
    title: 'Childhood',
    genre: 'Biography',
    author: 'Lev Nikolayevich Tolstoy',
    read: false,
  },
];

const router = (appNav) => {
  const url = 'mongodb://localhost:27017';
  const dbName = 'libraryApp';
  let client;
  let collection;
  const bookCollection = async () => {
    try {
      client = await MongoClient.connect(url);
      debug('Connected to mongodb');
      const db = client.db(dbName);
      collection = await db.collection('books');
      debug(collection);
    } catch (err) {
      debug(err.stack);
    }
    return { collection, client };
  };

  adminRouter.route('/books').get((_req, res) => {
    const getBooks = async () => {
      await bookCollection();
      const books = await collection.find().toArray();
      debug(books.length);
      res.render('bookListViewMongo', { title: 'MyBooks', appNav, books });
      client.close();
    };
    getBooks();
  });

  adminRouter.route('/books/:id').get((req, res) => {
    const getBook = async () => {
      await bookCollection();
      const { id } = req.params;
      const book = await collection.findOne({ _id: new ObjectID(id) });
      debug(book);
      res.render('bookView', { title: 'MyBooks', appNav, book });
      client.close();
    };
    getBook();
  });

  adminRouter.route('/insert').get((_req, res) => {
    const insertBooks = async () => {
      await bookCollection();
      const response = await collection.insertMany(booksToInsert);
      res.json(response);
      client.close();
    };
    insertBooks();
  });

  return adminRouter;
};

module.exports = router;
