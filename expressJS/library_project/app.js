// Node Imports/Requires
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sqlConnection = require('./src/lib/mysqlConn');

// App
const app = express();
const appPort = process.env.PORT || 3000;
const appNav = [
  { title: 'Books', link: '/books' },
  { title: 'Admin Books', link: '/admin/books' },
  { title: 'Authors', link: '/authors' },
];

// Routers
const bookRouter = require('./src/routes/bookRouter')(appNav, sqlConnection);
const adminRouter = require('./src/routes/adminRouter')(appNav);

// MIDDLEWARES:
// logging
// app.use(morgan('combined'));
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
// static
app.use(
  '/css',
  express.static(
    path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css'),
  ),
);
app.use(
  '/js',
  express.static(
    path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js'),
  ),
);
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')),
);
app.use('/books', bookRouter);
app.use('/admin', adminRouter);

app.get('/', (req, res) => {
  // res.send('Hello from my lib app');
  // res.sendFile(path.join(__dirname, 'views', 'index.html'));
  res.render('index', {
    title: 'MyEJSLib',
    appNav,
  });
});

app.listen(appPort, () => {
  debug(`App up and running listening on ${chalk.green(appPort)}`);
});
