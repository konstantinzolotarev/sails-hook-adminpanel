module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      elements: {
        files: 'elements/**',
        options: {
          livereload: true
        }
      },
      html: {
        files: ['index.html'],
        options: {
          livereload: true
        }
      },
      js: {
        files: 'scripts/**/*.js',
        options: {
          livereload: true
        }
      }
    },
    symlink: {
      test_files: {
        files: [
          {
            expand: true,
            overwrite: true,
            cwd: 'bower_components',
            src: ['*'],
            dest: 'test'
          },
          {
            expand: true,
            overwrite: true,
            src: ['apply*'],
            dest: 'test/apply-author-styles'
          }
        ]
      }
    },
    connect: {
      server: {
        options: {
          port: 8100,
          keepalive: false
        }
      }
    },
    // jasmine: {
    //   src: ['app/**/*.js'],
    //   options: {
    //     host: 'http://127.0.0.1:8100/',
    //     helpers: ['test/PolymerSetup.js'],
    //     specs: 'test/*Spec.js'
    //     // template: 'test/template.html'
    //   }
    // }
    shell: {
      test: {
        command: 'test/test_runner.sh'
      }
    },
    clean: {
      test_files: ['test/core-*', 'test/platform', 'test/polymer', 'test/apply-author-styles']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // A very basic default task.
  grunt.registerTask(
    'fake_pkg_dir',
    'Make a fake package dir in the test directory.',
    function() {
      grunt.log.write('Make.test/apply-author-styles...').ok();
      grunt.file.mkdir('test/apply-author-styles');
    }
  );


  grunt.registerTask('default', ['fake_pkg_dir', 'symlink:test_files', 'connect', 'shell:test', 'clean:test_files']);
};
