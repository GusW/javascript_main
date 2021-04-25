const express = require('express');
const debug = require('debug')('app:adminRouter');
const { ObjectID } = require('mongodb');
const { bookCollection } = require('../lib/mongoConn');

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
  adminRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  });
  adminRouter.route('/books').get((_req, res) => {
    const getBooks = async () => {
      let client;
      try {
        const { dbClient, collection } = await bookCollection();
        client = dbClient;
        const books = await collection.find().toArray();
        res.render('bookListViewMongo', { title: 'MyBooks', appNav, books });
      } catch (error) {
        debug(error.stack);
      } finally {
        if (client != null) {
          client.close();
        }
      }
    };
    getBooks();
  });

  adminRouter.route('/books/:id').get((req, res) => {
    const getBook = async () => {
      let client;
      try {
        const { dbClient, collection } = await bookCollection();
        client = dbClient;
        const { id } = req.params;
        const book = await collection.findOne({ _id: new ObjectID(id) });
        res.render('bookView', { title: 'MyBooks', appNav, book });
      } catch (error) {
        debug(error.stack);
      } finally {
        if (client != null) {
          client.close();
        }
      }
    };
    getBook();
  });

  adminRouter.route('/insert').get((_req, res) => {
    const insertBooks = async () => {
      let client;
      try {
        const { dbClient, collection } = await bookCollection();
        client = dbClient;
        const response = await collection.insertMany(booksToInsert);
        res.json(response);
      } catch (error) {
        debug(error.stack);
      } finally {
        if (client != null) {
          client.close();
        }
      }
    };
    insertBooks();
  });

  return adminRouter;
};

module.exports = router;
