const path = require('path')
const WebpackBar = require('webpackbar')

module.exports = {
  mode: "development",
  entry: "./src/lmgl.ts",
  output: {
    filename: "lmgl.max.js",
    path: path.join(__dirname, "../demo-ts/lib/")
  },
  devtool: "source-map",
  module: "commonjs",
  plugins: [
    new WebpackBar(),
  ],
  module: {
    rules: [{
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
        }]
      },
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