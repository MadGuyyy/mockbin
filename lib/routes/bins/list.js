'use strict'

var debug = require('debug-log')('mockbin')
var pkg = require('../../../package.json')

module.exports = function (req, res, next) {
  res.view = 'bin/list'
  var client = this.client;
  client.keys('bin:*', function (err, keys) {
    if (err) {
      debug(err)

      throw err
    }

    res.body = {
      bin: {
        version: '1.2',
        creator: {
          name: 'mockbin.com',
          version: pkg.version
        },
        entries: []
      }
    }

    if (keys.length) {
        keys.forEach((key, i) => {
            client.get(key, (err, value) => {
                let data = JSON.parse(value)
                data.path = key.replace('bin:','')
                res.body.bin.entries.push(data)
                if(i == keys.length-1) next()
            });
        });
    }
    else next()
  })
}
