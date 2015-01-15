'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var uuid = require('node-uuid');

var mediatorJsGenerator = yeoman.generators.Base.extend({
  
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
        message: 'What is your primary route path?'
      }];

    this.prompt(prompts, function (props) {
      this.configPort = props.configPort;
      this.mediatorName = props.mediatorName;
      this.mediatorDesc = props.mediatorDesc;
      this.mediatorRoutePath = props.mediatorRoutePath;

      done();
    }.bind(this));
  },
    
  scaffoldFolders: function(){
    this.mkdir("app/config");
    this.mkdir("build");
  },

  copyMainFiles: function(){

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
    this.template("_mediator.json", "app/config/mediator.json", context);

    this.copy("_config.json", "app/config/config.json");
    this.copy("_index.js", "app/index.js");
    this.copy("_register.js", "app/register.js");
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      callback: function () {
        // Have Yeoman greet the user.
        console.log(yosay(
          'Scaffolding Complete!\r' + 
          chalk.green('Remember "npm install"\r') + 
          'Goodbye!'
        ));
      }
    });
  }
});

module.exports = mediatorJsGenerator;