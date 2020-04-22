'use strict'

var debug = require('debug-log')('mockbin')
var util = require('util')

module.exports = function (req, res, next) {
  this.client.lset("log:" + req.params.uuid, req.params.id, "__DELETED__")
  this.client.lrem("log:" + req.params.uuid, 1, "__DELETED__")
  res.status(302).location(util.format('/bin/%s/log', req.params.uuid))
  next()
}