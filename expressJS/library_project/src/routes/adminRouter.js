const express = require('express');

const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const bookService = require('../services/goodreadService');

const adminRouter = express.Router();

const router = (appNav) => {
  const { authMiddleware } = authController(appNav);
  const { getIndex, getById, insertSome } = adminController(
    bookService,
    appNav,
  );

  adminRouter.use(authMiddleware);

  adminRouter.route('/books').get(getIndex);

  adminRouter.route('/books/:id').get(getById);

  adminRouter.route('/insertSome').get(insertSome);

  return adminRouter;
};

module.exports = router;
