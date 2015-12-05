module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['../javascripts/**/*.js']
    },
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint']);
};