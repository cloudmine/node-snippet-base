var BasicSnippet = require('./lib/basic_snippet');
var AsyncSnippet = require('./lib/basic_snippet');
var CloudMineNode = require('cloudmine-node');

CloudMineNode.start('./index.js', function(err) {
  console.log('Server Started?', err);
});

module.exports = {
  basicSnippet: BasicSnippet,
  AsyncSnippet: AsyncSnippet
};
