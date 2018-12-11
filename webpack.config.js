const path = require('path');

module.exports = {
  entry: './public/js/main.js',
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'mybundle.js'
  }
};