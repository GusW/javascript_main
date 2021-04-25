// Node Imports/Requires
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const sqlConnection = require('./src/lib/mysqlConn');
const passportConfig = require('./src/lib/passportConfig');

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
const authRouter = require('./src/routes/authRouter')(appNav);

// MIDDLEWARES:
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// replacement for bodyParser (`npm install body-parser`) - post to req body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session management
app.use(cookieParser());
app.use(session({ secret: 'my-secret-library' }));
passportConfig(app);

// logging
// app.use(morgan('combined'));
app.use(morgan('tiny'));

// Static
app.use(express.static(path.join(__dirname, 'public')));
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

// Routes
app.get('/', (req, res) => {
  // res.send('Hello from my lib app');
  // res.sendFile(path.join(__dirname, 'views', 'index.html'));
  res.render('index', {
    title: 'MyEJSLib',
    appNav,
  });
});
app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.listen(appPort, () => {
  debug(`App up and running listening on ${chalk.green(appPort)}`);
});
