const express = require('express');
const debug = require('debug')('app:bookRouter');

const bookRouter = express.Router();

const router = (appNav, sqlConnection) => {
  // bookRouter.route('/').get((req, res) => res.send('we have books'));
  let books = [];
  sqlConnection.query('SELECT * FROM books;', (err, res) => {
    if (err !== undefined && err !== null) {
      debug(`ERR: ${err}`);
      throw err;
    }
    debug(`RES: ${res}`);
    if (res !== undefined && res !== null) {
      books = res;
    }
  });
  bookRouter.route('/').get((req, res) => {
    res.render('bookListView', { title: 'MyBooks', appNav, books });
  });

  bookRouter
    .route('/:id')
    .all((req, res, next) => {
      const { id } = req.params;
      // TODO make a query to return SELECT * FROM books WHERE id = id;
      const bookArray = books.filter((bookItem) => bookItem.id === Number(id));
      if (bookArray === undefined) {
        res.status(404).send('Could not find book');
      }
      [req.book] = bookArray;
      next();
    })
    .get((req, res) => {
      res.render('bookView', { appNav, book: req.book });
    });

  return bookRouter;
};

module.exports = router;
