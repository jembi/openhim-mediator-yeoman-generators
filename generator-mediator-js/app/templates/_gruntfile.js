'use strict';

var path = require('path');

module.exports = function(grunt) {
  
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    //task config
    /*connect: {
      server: {
        options: {
          port: '<%= configPort %>',
          base: 'build',
          // Change this to '0.0.0.0' to access the server from outside.
          hostname: '0.0.0.0',
          livereload: 35729,
          keepalive: true,
          open: true
        }
      }
    },
    concat: {
      dist: {
        src: ["app/index.js"],
        dest: "build/index.js"
      }
    },*/
    express: {
      custom: {
        options: {
          port: '<%= configPort %>',
          hostname: '0.0.0.0',
          server: path.resolve('./build/index')
        }
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      app: {
        files: [{
          expand: true,
          cwd: 'app/',
          src: '**',
          dest: 'build/'
        }]
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-express');
 
  grunt.registerTask('serve', ['build', 'express', 'express-keepalive']);
  grunt.registerTask('build', ['copy:app']);
  grunt.registerTask('default', ['build']);
};