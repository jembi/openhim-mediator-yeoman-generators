'use strict'

const tap = require('tap')
const openhimMock = require('./openhim-mock')
const mediatorMock = require('../lib/index')

tap.test('Test server start', (t) => {
  openhimMock.start(() => {
    mediatorMock.start((mediatorServer) => {
      t.ok(mediatorServer)
      mediatorServer.close(() => {
        openhimMock.stop(() => {
          t.end()
        })
      })
    })
  })
})
