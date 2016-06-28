'use strict'

var config = require('./config')

exports.promptsList = (enablePrompts, nameProvided, descriptionProvided) => {
  var list = [
    {
      when: !nameProvided,
      type: 'input', 
      name: 'mediatorName',
      message: 'What is your Mediator\'s name?',
      validate: function(mediatorName) { return mediatorName==='' ? false : true }
    }, {
      when: !descriptionProvided,
      type: 'input', 
      name: 'mediatorDesc', 
      message: 'Describe what your Mediator does:',
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
      name: 'mediatorMaintainer', 
      message: 'Who is the maintainer of the mediator?',
      default: config.mediatorMaintainer
    }, {
      when: enablePrompts,
      type: 'input', 
      name: 'configPort', 
      message: 'Under what port number should the mediator run?', 
      default: config.configPort 
    }, {
      when: enablePrompts,
      type: 'input', 
      name: 'defaultChannelPath', 
      message: 'What is your default channel path?',
      default: config.defaultChannelPath
    }, {
      when: enablePrompts,
      type: 'input', 
      name: 'mediatorRouteHost', 
      message: 'What is your mediator ip address?',
      default: config.mediatorRouteHost
    }, {
      when: enablePrompts,
      type: 'input', 
      name: 'mediatorRoutePath', 
      message: 'What is your primary route path?',
      default: config.mediatorRoutePath
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
      when: function (response) { return response.configureApi },
      type: 'input',
      name: 'mediatorApiUrl',
      message: 'Enter the URL for the API:',
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
