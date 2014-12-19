'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var uuid = require('node-uuid');

var mediatorJavaGenerator = yeoman.generators.Base.extend({
  
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the marvelous ' + chalk.red('MediatorJava') + ' generator!'
    ));

    var prompts = [{ 
        type: 'input', 
        name: 'configGroupID', 
        message: 'What is your java group ID?', 
        default: 'org.openhim' ,
        validate: function(groupID){ 
          if(groupID !== ''){ return true; }else{ return 'Please supply your Java group ID'; } 
        } 
      }, { 
        type: 'input', 
        name: 'configArtifactID', 
        message: 'What is your java artifact ID?', 
        default: 'mediator-template' ,
        validate: function(artifactID){ 
          if(artifactID !== ''){ return true; }else{ return 'Please supply your Java artifact ID'; } 
        } 
      }, { 
        type: 'input', 
        name: 'configNamespace', 
        message: 'What is your Java namespace?', 
        default: 'org.openhim.mediator' ,
        validate: function(namespace){ 
          if(namespace !== ''){ return true; }else{ return 'Please supply your Java namespace'; } 
        } 
      }, { 
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
      this.configGroupID = props.configGroupID;
      this.configArtifactID = props.configArtifactID;
      this.configNamespace = props.configNamespace;

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

    var folders = this.configNamespace.split(".");
    var folderStructure = '';
    for ( var i=0; i<folders.length; i++ ){
      console.log( folders[i] )
      folderStructure += folders[i]+'/';
    }

    this.mkdir("src/main/java");
    this.mkdir("src/main/resources");

    // dynamic folder structure
    this.folderStructure = "src/main/java/"+folderStructure;
    this.mkdir( this.folderStructure );

  },

  copyMainFiles: function(){

    var context = { 
      configGroupID: this.configGroupID,
      configArtifactID: this.configArtifactID,
      configNamespace: this.configNamespace,

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

    // copy the templates and override placeholders
    this.template("_pom.xml", "pom.xml", context);
    this.template("_mediator.properties", "src/main/resources/mediator.properties", context);
    this.template("_mediator-registration-info.json", "src/main/resources/mediator-registration-info.json", context);
    this.template("_DefaultOrchestrator.java", this.folderStructure+"DefaultOrchestrator.java", context);
    this.template("_MediatorMain.java", this.folderStructure+"MediatorMain.java", context);

  },

  install: function () {
    this.installDependencies({
      bower: false,
      npm: true,
      skipInstall: true,
      skipMessage: true,
      callback: function () {
        // Have Yeoman greet the user.
        console.log(yosay(
          'Scaffolding Complete!\r' + chalk.green('Remember "npm install"') + '\r Goodbye!'
        ));
      }
    });
  }
});

module.exports = mediatorJavaGenerator;