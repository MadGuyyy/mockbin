'use strict'

var debug = require('debug-log')('mockbin')

module.exports = function (req, res, next) {
  this.client.get('bin:' + req.params.uuid, function (err, value) {
    if (err) {
      debug(err)

      throw err
    }

    if (value) {
      this.client.del('bin:' + req.params.uuid)
      res.status(201).location(util.format('/bin/list'))
    }

    next()
  })
}
