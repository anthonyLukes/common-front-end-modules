var CONFIG = require('./build-config.js');
module.exports = {
  output: {
    filename: CONFIG.JS.OUTPUT_FILE
  },
  devtool: 'source-map',
  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
  },
};