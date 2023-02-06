// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  // entry: "./src/index.js",
  entry: {
    client: "./src/index.js",
    // server: "../server.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  target: "web",
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),

    new MiniCssExtractPlugin(),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /environment.js/,
        use: {
          loader: path.resolve(__dirname, "loaders", "environment-replacer"),
        },
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

const serverConfig = {
  entry: {
    server: "../server.js",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  target: "node",
  externals: {
    express: "express",
    bufferutil: "bufferutil",
    "utf-8-validate": "utf-8-validate",
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
    serverConfig.mode = "production";
  } else {
    config.mode = "development";
    serverConfig.mode = "development";
  }
  return [config, serverConfig];
};
