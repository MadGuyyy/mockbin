'use strict'

var debug = require('debug-log')('mockbin')
var pkg = require('../../../package.json')

module.exports = function (req, res, next) {
  res.view = 'default'

  this.client.lindex('log:' + req.params.uuid, req.params.id, function (err, request) {
    if (err) {
      debug(err)

      throw err
    }

    res.body = {}

    if (request.length) {
      res.body = JSON.parse(request)
    }

    next()
  })
}
