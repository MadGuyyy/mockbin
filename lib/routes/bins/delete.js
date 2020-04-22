'use strict'

var debug = require('debug-log')('mockbin')
var util = require('util')

module.exports = function (req, res, next) {
  this.client.del('bin:' + req.params.uuid)
  this.client.del('log:' + req.params.uuid)
  res.status(302).location(util.format('/bin/list'))
  next()
}