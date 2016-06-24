'use strict'

var path = require('path')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')
var os = require('os')

describe('mediator-js:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'someOption': true })
      .withPrompts({
        somePrompt: true
      })
      .on('end', done)
  })

  it('creates files', function () {
    assert.file([
      'package.json',
      'lib/index.js',
      'lib/openhim.js',
      'lib/utils.js',
      'config/config.json',
      'config/mediator.json'
    ])
  })
})
