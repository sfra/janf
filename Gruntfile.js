module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  watch: {
    all: {
      options: { livereload: true },
      files: ['**/*.js','**/*.nhtml','**/*.conf']
    },
    },
    open: {
    all: {
        path: 'http://localhost:1337/',

    }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('serve', [
    'open',
    'watch'
    ]);

};

