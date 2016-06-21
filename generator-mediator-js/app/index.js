'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var uuid = require('node-uuid');
var optionOrPrompt = require('yeoman-option-or-prompt');

var mediatorJsGenerator = yeoman.generators.Base.extend({
  
  _optionOrPrompt: optionOrPrompt,
  
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the marvelous ' + chalk.red('MediatorJs') + ' generator!'
    ));

    var prompts = [{
        type: 'input', 
        name: 'mediatorName', 
        message: 'What is your Mediator\'s name?', 
        default: 'Yeoman Generated Mediator',
        validate: function(mediatorName){ 
          if(mediatorName !== ''){ return true; }else{ return 'Please supply a Mediator Name'; } 
        } 
      }, { 
        type: 'input', 
        name: 'mediatorDesc', 
        message: 'What does your Mediator do?',
        default: 'Brief Description'
      }, { 
        type: 'input', 
        name: 'configPort', 
        message: 'Under what port number should the mediator run?', 
        default: 3000 
      }, { 
        type: 'input', 
        name: 'mediatorRoutePath', 
        message: 'What is your primary route path?',
        default: 'primary/path/'
      }, { 
        name: 'enablePPA',
        type: 'confirm',
        message: 'Would you like to package your app?',
        default: false
      }, {
        when: function (response) {
          return response.enablePPA;
        },
        name: 'good-or-not',
        message: 'Sweet! Was it any good?'
      }];

    this._optionOrPrompt(prompts, function (props) {
      // Mediator settings
      this.configPort = props.configPort;
      this.mediatorName = props.mediatorName;
      this.mediatorDesc = props.mediatorDesc;
      this.mediatorRoutePath = props.mediatorRoutePath;
      
      // PPA settings
      this.enablePPA = props.enablePPA;
      
      done();
    }.bind(this));
  },
    
  scaffoldFolders: function() {
    this.mkdir("config/");
    this.mkdir("lib/");
    this.mkdir("test/");
    
    if(this.enablePPA) {
      this.mkdir("packaging/")
    }
  },

  copyMainFiles: function() {

    var context = { 
      configPort: this.configPort,
      mediatorUUID: "urn:uuid:"+uuid.v1(),
      appName: this.mediatorName.replace(/ /g,"-"),
      mediatorName: this.mediatorName,
      mediatorDesc: this.mediatorDesc,
      mediatorRoutePath: this.mediatorRoutePath,
    };

    this.template("_gruntfile.js", "Gruntfile.js", context);
    this.template("_package.json", "package.json", context);
    this.template("_mediator.json", "config/mediator.json", context);

    this.copy("_config.json", "config/config.json");
    this.copy("_index.js", "lib/index.js");
    this.copy("_register.js", "lib/register.js");
  },

  install: function () {
    this.installDependencies({
      npm:true,
      bower:false,
      skipInstall: this.options['skip-install'],
      callback: function () {
        // On successful install, have Yeoman greet the user.
        console.log(yosay(
          'Scaffolding Complete!\r' + 
          chalk.green('Remember: "npm start"\r') + 
          'Goodbye!'
        ));
      }
    });
  }
});

module.exports = mediatorJsGenerator;