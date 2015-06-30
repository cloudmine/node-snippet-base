'use strict';
//
// CloudMine, Inc.
// 2015
//

var BasicSnippet = require('./lib/basic_snippet');
var AsyncSnippet = require('./lib/async_snippet');
var CloudMineNode = require('cloudmine-servercode');

module.exports = {
  basic: BasicSnippet,
  async: AsyncSnippet
};

CloudMineNode.start(module, './index.js', function(err) {
  console.log('Server Started?', err);
});
