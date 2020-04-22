'use strict'

var debug = require('debug-log')('mockbin')
var pkg = require('../../../package.json')

module.exports = function (req, res, next) {
  res.view = 'bin/log'

  this.client.lrange('log:' + req.params.uuid, 0, -1, function (err, history) {
    if (err) {
      debug(err)

      throw err
    }

    res.body = {
      log: {
        version: '1.2',
        creator: {
          name: 'mockbin.com',
          version: pkg.version
        },
        entries: []
      }
    }

    if (history.length) {
      res.body.log.entries = history.map(function (request) {
        var requestData = JSON.parse(request)
        if (requestData.request.bodySize > 1000 && requestData.request.postData && requestData.request.postData.text) {
          requestData.request.postData.text = requestData.request.postData.text.substring(0, 1000) + '...'
        }
        return requestData;
      })
    }

    next()
  })
}
