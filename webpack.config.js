const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'canvas-flex.js',
    path: path.resolve(__dirname, 'dist'),
  },
};