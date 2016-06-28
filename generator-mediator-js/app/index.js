'use strict'

var generator = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')
var uuid = require('node-uuid')

var prompts = require('./prompts')
var config = require('./config')

var mediatorJsGenerator = generator.Base.extend({
  constructor: function () {
    generator.Base.apply(this, arguments)

    this.option('useDefaults')
    this.enablePrompts = (this.options.useDefaults ? false : true)
    
    this.option('name')
    this.nameProvided = (this.options.name ? true : false)
    
    this.option('description')
    this.descriptionProvided = (this.options.description ? true : false)
  },
  
  prompting: function () {
    return this.prompt(prompts.promptsList(this.enablePrompts, this.nameProvided, this.descriptionProvided)).then(function (props) {
      // Mediator settings
      this.mediatorName = this.options.name || props.mediatorName
      this.mediatorDesc = this.options.description || props.mediatorDesc
      this.mediatorAuthor = props.mediatorAuthor || config.mediatorAuthor
      this.mediatorMaintainer = props.mediatorMaintainer || config.mediatorMaintainer
      this.configPort = props.configPort || config.configPort
      this.defaultChannelPath = props.defaultChannelPath || config.defaultChannelPath
      this.mediatorRoutePath = props.mediatorRoutePath || config.mediatorRoutePath
      this.mediatorRouteHost = props.mediatorRouteHost || config.mediatorRouteHost
      
      // API settings
      this.configureApi = props.configureApi || config.configureApi
      this.mediatorApiUsername = props.mediatorApiUsername || config.mediatorApiUsername
      this.mediatorApiPassword = props.mediatorApiPassword || config.mediatorApiPassword
      this.mediatorApiUrl = props.mediatorApiUrl || config.mediatorApiUrl
      this.mediatorApiSsl = props.mediatorApiSsl || config.mediatorApiSsl
      this.mediatorRegister = props.mediatorRegister || config.mediatorRegister
      
      // PPA settings
      this.enablePPA = props.enablePPA || config.enablePPA
      this.ppaUsername = props.ppaUsername || config.ppaUsername
    }.bind(this))
  },

  writing: function() {
    // Set up context objects to populate templates
    var mediatorContext = { 
      configPort: this.configPort,
      mediatorUUID: "urn:uuid:" + uuid.v1(),
      appName: this.mediatorName.replace(/ /g,"-"),
      mediatorName: this.mediatorName,
      mediatorDesc: this.mediatorDesc,
      mediatorAuthor: this.mediatorAuthor,
      mediatorMaintainer: this.mediatorMaintainer,
      defaultChannelPath: this.defaultChannelPath,
      mediatorRouteHost: this.mediatorRouteHost,
      mediatorRoutePath: this.mediatorRoutePath
    }
    
    var apiContext = {
      mediatorApiUsername: this.mediatorApiUsername,
      mediatorApiPassword: this.mediatorApiPassword,
      mediatorApiUrl: this.mediatorApiUrl,
      mediatorApiSsl: this.mediatorApiSsl,
      mediatorRegister: this.mediatorRegister
    }
    
    var ppaContext = {
      ppaUsername: this.ppaUsername,
      mediatorName: this.mediatorName,
      appName: this.mediatorName.replace(/ /g,"-"),
      mediatorMaintainer: this.mediatorMaintainer,
      mediatorDesc: this.mediatorDesc
    }
    
    // Add the mediator files
    this.fs.copyTpl(this.templatePath('mediatorTemplate/_package.json'), this.destinationPath('package.json'), mediatorContext)
    this.fs.copyTpl(this.templatePath('mediatorTemplate/_.gitignore'), this.destinationPath('.gitignore'))
    this.fs.copyTpl(this.templatePath('mediatorTemplate/_README.md'), this.destinationPath('README.md'), mediatorContext)
    this.fs.copyTpl(this.templatePath('mediatorTemplate/config/_mediator.json'), this.destinationPath('config/mediator.json'), mediatorContext)
    this.fs.copyTpl(this.templatePath('mediatorTemplate/config/_config.json'), this.destinationPath('config/config.json'), apiContext)
    this.fs.copyTpl(this.templatePath('mediatorTemplate/lib/_index.js'), this.destinationPath('lib/index.js'))
    this.fs.copyTpl(this.templatePath('mediatorTemplate/lib/_openhim.js'), this.destinationPath('lib/openhim.js'))
    this.fs.copyTpl(this.templatePath('mediatorTemplate/lib/_utils.js'), this.destinationPath('lib/utils.js'))
    this.fs.copyTpl(this.templatePath('mediatorTemplate/test/_openhim.js'), this.destinationPath('test/openhim.js'))
    this.fs.copyTpl(this.templatePath('mediatorTemplate/test/_test-openhim-server.js'), this.destinationPath('test/test-openhim-server.js'))
    
    // Add the PPA files
    this.fs.copyTpl(this.templatePath('packagingTemplate/_.dput.cf'), this.destinationPath('packaging/.dput.cf'), ppaContext)
    this.fs.copyTpl(this.templatePath('packagingTemplate/_cp-mediators-into-pkg.sh'), this.destinationPath('packaging/cp-mediators-into-pkg.sh'), ppaContext)
    this.fs.copyTpl(this.templatePath('packagingTemplate/_create-deb.sh'), this.destinationPath('packaging/create-deb.sh'), ppaContext)
    this.fs.copyTpl(this.templatePath('packagingTemplate/targets/trusty/debian/_changelog'), this.destinationPath('packaging/targets/trusty/debian/changelog'), ppaContext)
    this.fs.copyTpl(this.templatePath('packagingTemplate/targets/trusty/debian/_control'), this.destinationPath('packaging/targets/trusty/debian/control'), ppaContext)
    this.fs.copyTpl(this.templatePath('packagingTemplate/targets/trusty/debian/_postinst'), this.destinationPath('packaging/targets/trusty/debian/postinst'), ppaContext)
    this.fs.copyTpl(this.templatePath('packagingTemplate/targets/trusty/etc/init/_mediator.conf'), this.destinationPath('packaging/targets/trusty/etc/init/' + ppaContext.appName), ppaContext)
    this.fs.copyTpl(this.templatePath('packagingTemplate/targets/trusty/debian/_config'), this.destinationPath('packaging/targets/trusty/debian/config'))
    this.fs.copyTpl(this.templatePath('packagingTemplate/targets/trusty/debian/_install'), this.destinationPath('packaging/targets/trusty/debian/install'))
    this.fs.copyTpl(this.templatePath('packagingTemplate/targets/trusty/debian/_rules'), this.destinationPath('packaging/targets/trusty/debian/rules'))
    this.fs.copyTpl(this.templatePath('packagingTemplate/targets/trusty/debian/_templates'), this.destinationPath('packaging/targets/trusty/debian/templates'))
    this.fs.copyTpl(this.templatePath('packagingTemplate/targets/trusty/etc/openhim/_install-node-4.sh'), this.destinationPath('packaging/targets/trusty/etc/openhim/install-node-4.sh'))
  },

  install: function () {
    this.installDependencies({
      npm: true,
      bower: false,
      callback: function () {
        // On successful install, have Yeoman greet the user.
        console.log(yosay(
          'Scaffolding Complete!\r' + 
          chalk.green('Simply run: "npm start"\r') + 
          'Goodbye!'
        ))
      }
    })
  }
})

module.exports = mediatorJsGenerator