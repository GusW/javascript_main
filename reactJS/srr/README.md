https://github.com/danielstern/server-rendered-react-app

## init

    npm init --y

    yarn add debug nodemon --save
    yarn add react react-dom express --save

    yarn add webpack webpack-cli webpack-dev-server --save
    yarn add @babel/core @babel/node babel-loader --save
    yarn add @babel/preset-env @babel/preset-react --save

## .babelrc

    {
    "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
        ]
    }

## webpack.config.js

    module.exports = {
      mode: "development",
      entry: {
        client: "./client/client.jsx",
      },
      output: {
        filename: "[name].js",
      },
      resolve: {
        extensions: [".js", ".jsx"],
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env", "@babel/  preset-react"]  ,
              },
            },
          },
        ],
      },
     };

## scripts

    "start": "babel-node server",
    "build": "webpack"
