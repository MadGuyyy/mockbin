'use strict'

var debug = require('debug-log')('mockbin')
var express = require('express')
var mw = require('../middleware')
var redis = require('redis')
var routes = require('./bins/')
var url = require('url')

module.exports = function bins (dsn_str) {
  // parse redis dsn
  var dsn = url.parse(dsn_str)

  // connect to redis
  this.client = redis.createClient(dsn.port, dsn.hostname, {
    auth_pass: dsn.auth ? dsn.auth.split(':').pop() : false
  })

  this.client.on('error', function (err) {
    debug('redis error:', err)
  })

  var router = express.Router()

  var defaults = [mw.forwarded, mw.errorHandler, mw.bodyParser, null, mw.cors, mw.negotiateContent]

  var endpoints = [
    { action: 'get', path: '/bin/create', route: routes.form.bind(this) },
    { action: 'get', path: '/bin/list', route: routes.list.bind(this) },
    { action: 'post', path: '/bin/create', route: routes.create.bind(this) },
    { action: 'get', path: '/bin/:uuid/view', route: routes.view.bind(this) },
    { action: 'get', path: '/bin/:uuid/delete', route: routes.delete.bind(this) },
    { action: 'get', path: '/bin/:uuid/clear', route: routes.clear.bind(this) },
    { action: 'get', path: '/bin/:uuid/view/:id', route: routes.source.bind(this) },
    { action: 'get', path: '/bin/:uuid/delete/:id', route: routes.deleterequest.bind(this) },
    { action: 'get', path: '/bin/:uuid/sample', route: routes.sample.bind(this) },
    { action: 'get', path: '/bin/:uuid/log', route: routes.log.bind(this) },
    { action: 'all', path: '/:uuid*', route: routes.run.bind(this) }
  ]

  endpoints.forEach(function (endpoint) {
    // add route to middleware
    defaults.splice(3, 1, endpoint.route)

    // assign router to action at path
    router[endpoint.action].apply(router, [endpoint.path].concat(defaults))
  })

  return router
}
