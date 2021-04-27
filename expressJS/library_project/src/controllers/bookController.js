const debug = require('debug')('app:bookController');

const bookController = (appNav, sqlConnection) => {
  let books = [];
  try {
    sqlConnection.query('SELECT * FROM books;', (err, res) => {
      if (err !== undefined && err !== null) {
        throw err;
      }
      if (res !== undefined && res !== null) {
        books = res;
      }
    });
  } catch (error) {
    debug(error.stack);
  }

  const getIndex = (_req, res) => {
    try {
      res.render('bookListView', { title: 'MyBooks', appNav, books });
    } catch (error) {
      debug(error.stack);
    }
  };

  const bookMiddleware = (req, res, next) => {
    try {
      const { id } = req.params;
      // TODO make a query to return SELECT * FROM books WHERE id = id;
      const bookArray = books.filter((bookItem) => bookItem.id === Number(id));
      if (bookArray === undefined) {
        res.status(404).send('Could not find book');
      }
      [req.book] = bookArray;
    } catch (error) {
      debug(error.stack);
    } finally {
      next();
    }
  };

  const getById = (req, res) => {
    try {
      res.render('bookView', { appNav, book: req.book });
    } catch (error) {
      debug(error.stack);
    }
  };

  return {
    getIndex,
    bookMiddleware,
    getById,
  };
};

module.exports = bookController;
