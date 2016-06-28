#!/usr/bin/env node
'use strict'

const express = require('express')
const medUtils = require('openhim-mediator-utils')

const utils = require('./utils')
const OpenHIM = require('./openhim')

// Config
var config = {} // this will vary depending on whats set in openhim-core
const apiConf = require('../config/config')
const mediatorConfig = require('../config/mediator')

var port = mediatorConfig.endpoints[0].port

/**
 * setupApp - configures the http server for this mediator
 *
 * @return {express.App}  the configured http server
 */
function setupApp () {
  const app = express()

  app.all(mediatorConfig.endpoints[0].path, (req, res) => {
    console.log(`Processing ${req.method} request on ${mediatorConfig.endpoints[0].path}`)
    var responseBody = 'Primary Route Reached'
    var headers = { 'content-type': 'application/json' }

    // add logic to alter the request here
    
    // capture orchestration data
    var orchestrationResponse = { statusCode: 200, headers: headers }
    let orchestrations = []
    orchestrations.push(utils.buildOrchestration('Primary Route', new Date().getTime(), req.method, req.url, req.body, orchestrationResponse, responseBody))

    // set content type header so that OpenHIM knows how to handle the response
    res.set('Content-Type', 'application/json+openhim')

    // construct return object
    var properties = { property: 'Primary Route' }
    res.send(utils.buildReturnObject(mediatorConfig.urn, 'Successful', 200, headers, responseBody, orchestrations, properties))
  })
  return app
}

/**
 * start - starts the mediator
 *
 * @param  {Function} callback a node style callback that is called once the
 * server is started
 */
function start (callback) {
  if (apiConf.api.trustSelfSigned) { process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' }

  if (apiConf.register) {
    medUtils.registerMediator(apiConf.api, mediatorConfig, (err) => {
      if (err) {
        console.log('Failed to register this mediator, check your config')
        console.log(err.stack)
        process.exit(1)
      }
      apiConf.api.urn = mediatorConfig.urn
      medUtils.fetchConfig(apiConf.api, (err, newConfig) => {
        console.log('Received initial config:')
        console.log(JSON.stringify(newConfig))
        config = newConfig
        if (err) {
          console.log('Failed to fetch initial config')
          console.log(err.stack)
          process.exit(1)
        } else {
          console.log('Successfully registered mediator!')
          let app = setupApp()
          const server = app.listen(port, () => {
            let configEmitter = medUtils.activateHeartbeat(apiConf.api)
            configEmitter.on('config', (newConfig) => {
              console.log('Received updated config:')
              console.log(JSON.stringify(newConfig))
              // set new config for mediator
              config = newConfig
              
              // we can act on the new config received from the OpenHIM here
              
            })
            callback(server)
          })
        }
      })
    })
  } else {
    // default to config from mediator registration
    config = mediatorConfig.config
    let app = setupApp()
    const server = app.listen(port, () => callback(server))
  }
}
exports.start = start

if (!module.parent) {
  // if this script is run directly, start the server
  start(() => console.log(`Listening on ${port}...`))
}
