'use strict';
//
// CloudMine, Inc.
// 2015
//

module.exports = function(req, reply) {
  setTimeout(function() {
    reply({text: 'This took 5 seconds!'});
  }, 5000);
};
