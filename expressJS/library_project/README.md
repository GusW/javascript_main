# Project Steps

#### $ `npm init`

#### Create file `<projectFolder>/.npmrc` with:

    save=true
    save-exact=true

#### $ `npm install express chalk debug morgan`

#### $ `npm install jquery bootstrap`

#### $ `npm install ejs`

#### Install vscode EJS extension

#### $ `npm install mysql2`

#### $ `npm install mongodb`

#

### Run Debug in Fish Shell

#

#### ALL: $ `env DEBUG="*" node app.js`

#### APP only: $ `env DEBUG="app" node app.js`

#

#### JqueryCDN: http://code.jquery.com/

#### BootstrapCDN: https://www.bootstrapcdn.com/

#

## DevDependencies

#

#### $ `npm install eslint`

#### $ `eslint init`

#### Install vscode ESLint extension

#### $ `npm install nodemon`

#

## Databases - MySQL

#

#### $ `docker volume create PSLibrary`

#### $ `docker run -p 3306:3306 --name PSLibrary -v PSLibrary:/var/lib/mysql/ -e MYSQL_ROOT_PASSWORD=library -d mysql:latest`

#### $ `docker exec -it PSLibrary mysql -uroot -p`

    mysql > CREATE DATABASE PSLibrary;

    mysql > USE PSLibrary;

    mysql > CREATE TABLE books (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     author VARCHAR(255) NOT NULL);

    mysql > INSERT INTO books(title, author)
     VALUES
      ("War and Peace", "Lev Nikolayevich Tolstoy"),
      ("Les Miserables", "Victor Hugo"),
      ("The Time Machine", "H. G. Wells"),
      ("A Journey into the Center of the Earth", "Jules Verne"),
      ("The Dark World", "Henry Kuttner"),
      ("The Wind in the Willows", "Kenneth Grahame"),
      ("Life On The Mississippi", "Mark Twain"),
      ("Childhood", "Lev Nikolayevich Tolstoy");

#

## Databases - MongoDB

#

#### $ `docker volume create LibMongo`

#### $ `docker run -p 27017:27017 --name LibMongo -v LibMongo:/data/db -d mongo`

#### $ `docker exec -it LibMongo bash`

    # mongo
    > show dbs
    > user libraryApp
    > db.books.find().pretty()

#

## Troubleshooting

#

#### $ `lsof -i tcp:3000`
