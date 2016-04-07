'use strict';
//
// CloudMine, Inc.
// 2015
//

module.exports = function(req, reply) {
  //reply({text: 'Hello World!'});
  reply(req.payload);
};
