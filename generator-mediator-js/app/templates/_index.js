// load modules
var express = require('express')
var app = express()
var needle = require('needle');

// get config objects
var config = require("./config/config");
var apiConfig = config.api;
var mediatorConfig = require("./config/mediator");

// include register script
var register = require("./register");
register.registerMediator( apiConfig, mediatorConfig)


/* ######################### */
/* ##### Server Setup  ##### */
/* ######################### */

/* ##### Default Endpoint  ##### */
app.get('/', function (req, res) { 

  res.send('Primary Route');
  
})

// export app for use in grunt-express module
module.exports = app;

/* ######################### */
/* ##### Server Setup  ##### */
/* ######################### */
