const debug = require('debug')('app:adminController');
const { ObjectID } = require('mongodb');

const { bookCollection } = require('../lib/mongoConn');

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

const adminController = (bookService, appNav) => {
  const getIndex = async (_req, res) => {
    try {
      const { dbClient, collection } = await bookCollection();
      const books = await collection.find().toArray();
      res.render('bookListViewMongo', { title: 'MyBooks', appNav, books });
      dbClient.close();
    } catch (error) {
      debug(error.stack);
    }
  };

  const getById = async (req, res) => {
    try {
      const { dbClient, collection } = await bookCollection();
      const { id } = req.params;
      const book = await collection.findOne({ _id: new ObjectID(id) });
      book.details = await bookService.getBookById(id);
      debug(book.details);
      res.render('bookView', { title: 'MyBooks', appNav, book });
      dbClient.close();
    } catch (error) {
      debug(error.stack);
    }
  };

  const insertSome = async (_req, res) => {
    try {
      const { dbClient, collection } = await bookCollection();
      const response = await collection.insertMany(booksToInsert);
      res.json(response);
      dbClient.close();
    } catch (error) {
      debug(error.stack);
    }
  };

  return { getIndex, getById, insertSome };
};

module.exports = adminController;
