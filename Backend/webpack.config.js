const path = require('path');

module.exports = {
  entry: './src/index.js', // Update with your actual entry file
  mode: 'development', // or 'production' or 'none'
  // other configurations...
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
