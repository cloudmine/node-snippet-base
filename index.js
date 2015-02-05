var BasicSnippet = require('./lib/basic_snippet');
var AsyncSnippet = require('./lib/basic_snippet');
var CloudMineNode = require('cloudmine-servercode');

module.exports = {
  basicSnippet: BasicSnippet,
  AsyncSnippet: AsyncSnippet
};

CloudMineNode.start(module, './index.js', function(err) {
  console.log('Server Started?', err);
});
