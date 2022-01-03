const path = require('path')
const WebpackBar = require('webpackbar')

module.exports = {
  mode: "development",
  entry: "./src/windowInput.ts",
  output: {
    filename: "lmgl2.js",
    path: path.join(__dirname, "./dist")
  },
  devtool: "source-map",
  plugins: [
    new WebpackBar(),
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
