'use strict'

var config = require('./config')

exports.promptsList = (enablePrompts, nameProvided, descriptionProvided) => {
  var list = [
    {
      when: !nameProvided,
      type: 'input', 
      name: 'mediatorName',
      message: 'What is your mediator\'s name?',
      validate: function(mediatorName) { return mediatorName==='' ? false : true }
    }, {
      when: !descriptionProvided,
      type: 'input', 
      name: 'mediatorDesc', 
      message: 'Describe what your mediator does:',
      validate: function(mediatorDesc) { return mediatorDesc==='' ? false : true }
    }, {
      when: enablePrompts,
      type: 'input', 
      name: 'mediatorAuthor', 
      message: 'Who is the author of this mediator?',
      default: config.mediatorAuthor
    }, {
      when: enablePrompts,
      type: 'input', 
      name: 'configPort', 
      message: 'What port number would you like the mediator to run on?', 
      default: config.configPort 
    }, {
      when: enablePrompts,
      type: 'confirm',
      name: 'nonLocalMediator',
      message: 'Will this mediator be run alongside the OpenHIM?', 
      default: false
    }, {
      when: function (response) { return response.nonLocalMediator },
      type: 'input', 
      name: 'mediatorHost', 
      message: 'What is your mediator\'s ip address?',
      default: 'xx.xx.xx.xx',
      validate: function(mediatorHost) { return mediatorHost==='xx.xx.xx.xx' ? false : true }
    }, {
      when: function (response) { return response.nonLocalMediator },
      type: 'input',
      name: 'mediatorApiUrl',
      message: 'Enter the URL for the OpenHIM API:',
      default: 'https://xx.xx.xx.xx:8080',
      validate: function(mediatorApiUrl) { return mediatorApiUrl==='https://xx.xx.xx.xx:8080' ? false : true }
    }, {
      when: enablePrompts,
      type: 'input', 
      name: 'defaultChannelPath', 
      message: 'What path should the mediator\'s default channel on the OpenHIM listen on?',
      default: config.defaultChannelPath
    }, {
      when: enablePrompts,
      type: 'input', 
      name: 'mediatorPath', 
      message: 'What path should the mediator\'s default channel on the OpenHIM route requests to on the mediator?',
      default: config.mediatorPath
    }, {
      when: enablePrompts,
      name: 'configureApi',
      type: 'confirm',
      message: 'Would you like to change the default OpenHIM API settings?',
      default: false
    }, {
      when: function (response) { return response.configureApi },
      type: 'input',
      name: 'mediatorApiUsername',
      message: 'Enter your username for the API:',
      default: config.mediatorApiUsername
    }, {
      when: function (response) { return response.configureApi },
      type: 'password',
      name: 'mediatorApiPassword',
      message: 'Enter your password for the API:',
      default: config.mediatorApiPassword
    }, {
      when: function (response) { return response.configureApi && response.localMediator },
      type: 'input',
      name: 'mediatorApiUrl',
      message: 'Enter the URL for the OpenHIM API:',
      default: config.mediatorApiUrl
    }, {
      when: function (response) { return response.configureApi },
      type: 'confirm',
      name: 'mediatorApiSsl',
      message: 'Would you like to bypass the SSL of the server?',
      default: config.mediatorApiSsl
    }, {
      when: function (response) { return response.configureApi },
      type: 'confirm',
      name: 'mediatorRegister',
      message: 'Would you like the mediator to register itself with the OpenHIM?',
      default: config.mediatorApiRegister
    }, {
      when: enablePrompts,
      name: 'enablePPA',
      type: 'confirm',
      message: 'Would you like to package your app?',
      default: config.enablePPA
    }, {
      when: function (response) { return response.enablePPA },
      type: 'input',
      name: 'ppaUsername',
      message: 'Enter your PPA username:',
      default: config.ppaUsername
    }
  ]
  return list
}
