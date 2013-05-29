module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 8000,
          base: 'app',
          keepalive: true
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      },
      watch: {
        configFile: 'karma.conf.js',
        autoWatch: true,
        singleRun: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-karma');

  // Default task(s).
  grunt.registerTask('default', ['connect']);

};

