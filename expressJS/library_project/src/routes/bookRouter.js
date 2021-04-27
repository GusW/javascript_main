const express = require('express');
const authController = require('../controllers/authController');
const bookController = require('../controllers/bookController');

const bookRouter = express.Router();

const router = (appNav, sqlConnection) => {
  const { authMiddleware } = authController(appNav);
  // eslint-disable-next-line object-curly-newline
  const { getIndex, bookMiddleware, getById } = bookController(
    appNav,
    sqlConnection,
  );

  bookRouter.use(authMiddleware);

  bookRouter.route('/').get(getIndex);

  bookRouter.route('/:id').all(bookMiddleware).get(getById);

  return bookRouter;
};

module.exports = router;
