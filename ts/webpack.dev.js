const path = require('path')
const WebpackBar = require('webpackbar')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const forkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  mode: "development",
  entry: "./app.ts",
  output: {
    filename: "build.js",
    path: path.join(__dirname, "./dist")
  },
  devtool: "source-map",
  module: "commonjs",
  devServer: {
    port: 9999,
    open: false,
    compress: false,
    contentBase: path.join(__dirname,"./")
  },
  plugins: [
    new WebpackBar(),
    new HtmlWebpackPlugin({
      title: "hello",
      filename: "index.html",
      template: "./index.html",
      inject: true
    }),
    new forkTsCheckerWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
          use: [{
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }]
      }
    ]
  },
   resolve: {
     extensions: ['.tsx', '.ts', '.js']
   },
}
