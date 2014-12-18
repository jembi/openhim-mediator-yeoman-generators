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

    var prompts = [
      { 
        type: 'input', 
        name: 'configPort', 
        message: 'Under what port number should the mediator run?', 
        default: 3000 
      }, { 
        type: 'input', 
        name: 'configApiUsername', 
        message: 'What is your OpenHIM API Username?', 
        default: 'root@openhim.org',
        validate: function(username){ 
          if(username !== ''){ return true; }else{ return 'Please supply your username'; } 
        } 
      }, { 
        type: 'password', 
        name: 'configApiPassword', 
        message: 'What is your OpenHIM API password?', 
        default: 'HIM123',
        validate: function(password){ 
          if(password !== ''){ return true; }else{ return 'Please supply your password'; } 
        } 
      }, { 
        type: 'input', 
        name: 'configApiUrl', 
        message: 'What is your OpenHIM API URL?', 
        default: 'https://openhim-preprod.jembi.org:8080',
        validate: function(apiUrl){ 
          if(apiUrl !== ''){ return true; }else{ return 'Please supply your OpenHIM API URL'; } 
        } 
      }, { 
        type: 'input', 
        name: 'mediatorName', 
        message: 'What is your Mediators Name?', 
        default: 'Yeoman Generated Mediator',
        validate: function(mediatorName){ 
          if(mediatorName !== ''){ return true; }else{ return 'Please supply a Mediator Name'; } 
        } 
      }, { 
        type: 'input', 
        name: 'mediatorDesc', 
        message: 'What does your Mediator Do?',
        default: 'Brief Description'
      }, { 
        type: 'input', 
        name: 'mediatorUrlPattern', 
        message: 'What is your Mediator URL pattern?', 
        default: '/urlpattern',
        validate: function(mediatorUrlPattern){ 
          if(mediatorUrlPattern !== ''){ return true; }else{ return 'Please supply your Mediator URL pattern'; } 
        } 
      }, { 
        type: 'input', 
        name: 'mediatorRoutePath', 
        message: 'What is your primary route path?', 
        default: 'primary-route',
        validate: function(mediatorRoutePath){ 
          if(mediatorRoutePath !== ''){ return true; }else{ return 'Please supply your primary route path'; } 
        } 
      }, { 
        type: 'input', 
        name: 'mediatorRoutePort', 
        message: 'What is your primary route port?', 
        default: 3000,
        validate: function(mediatorRoutePort){ 
          if(mediatorRoutePort !== ''){ return true; }else{ return 'Please supply your primary route port'; } 
        } 
      }];

    this.prompt(prompts, function (props) {
      this.configPort = props.configPort;
      this.configApiUsername = props.configApiUsername;
      this.configApiPassword = props.configApiPassword;
      this.configApiUrl = props.configApiUrl;

      this.mediatorName = props.mediatorName;
      this.mediatorDesc = props.mediatorDesc;
      this.mediatorUrlPattern = props.mediatorUrlPattern;
      this.mediatorRoutePath = props.mediatorRoutePath;
      this.mediatorRoutePort = props.mediatorRoutePort;

      done();
    }.bind(this));
  },
    
  scaffoldFolders: function(){
    this.mkdir("app");
    this.mkdir("app/config");
    this.mkdir("build");
  },

  copyMainFiles: function(){

    var context = { 
      configPort: this.configPort,
      configApiUsername: this.configApiUsername,
      configApiPassword: this.configApiPassword,
      configApiUrl: this.configApiUrl,
      mediatorUUID: "urn:uuid:"+uuid.v1(),
      appName: this.mediatorName.replace(/ /g,"-"),
      mediatorName: this.mediatorName,
      mediatorDesc: this.mediatorDesc,
      mediatorUrlPattern: this.mediatorUrlPattern,
      mediatorRoutePath: this.mediatorRoutePath,
      mediatorRoutePort: this.mediatorRoutePort
    };

    this.template("_gruntfile.js", "Gruntfile.js", context);
    this.template("_package.json", "package.json", context);
    this.template("_config.json", "app/config/config.json", context);
    this.template("_mediator.json", "app/config/mediator.json", context);

    this.copy("_index.js", "app/index.js");
  },

  install: function () {
    this.installDependencies({
      bower: false,
      npm: true,
      skipInstall: true,
      skipMessage: true,
      callback: function () {
        console.log(' ');
        console.log(' ');
        console.log('Everything is all scaffolded!');
        console.log(' ');
        console.log(' ');
        console.log('Remember to "npm install"');
      }
    });
  }
});


module.exports = mediatorJsGenerator;