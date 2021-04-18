const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const path = require("path");

const APP_PORT = 3000;

const app = express();

// MIDDLEWARES:
// logging
// app.use(morgan('combined'));
app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "public")));
// static
app.use(
  "/css",
  express.static(
    path.join(__dirname, "node_modules", "bootstrap", "dist", "css")
  )
);
app.use(
  "/js",
  express.static(
    path.join(__dirname, "node_modules", "bootstrap", "dist", "js")
  )
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules", "jquery", "dist"))
);

app.get("/", (req, res) => {
  // res.send('Hello from my lib app');
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.listen(APP_PORT, () => {
  debug(`App up and running listening on ${chalk.green(APP_PORT)}`);
});
