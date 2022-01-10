const path = require('path')
const WebpackBar = require('webpackbar')

module.exports = function (env) {
  // console.log(env);
  let mode = "";
  let outFileName = "";
  let devtool = "";

  if (env === "production") {
    mode = "production"
    outFileName = "lmgl2.min.js"
  } else {
    mode = "development"
    outFileName = "lmgl2.max.js"
    devtool = "source-map"
  }

  return {
    mode: mode,
    entry: "./src/windowInput.ts",
    output: {
      filename: outFileName,
      path: path.join(__dirname, "./dist")
    },
    devtool: devtool,
    plugins: [
      new WebpackBar(),
    ],
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader'
        }]
      }]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
  }
}
