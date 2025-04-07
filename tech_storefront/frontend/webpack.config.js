const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
    publicPath: "/static/frontend/",
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  optimization: {
    minimize: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    }),
  ],

  devServer: {
    static: {
      directory: path.resolve(__dirname, "./static/frontend"),
    },
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true, // important for React Router
  },

};