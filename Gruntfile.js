module.exports = function(grunt){

  grunt.initConfig({
    pkg:grunt.file.readJSON('package.json'),

    watch:{
      styles:{
        files:[ 'source/styles/**/*.scss' ],
        tasks:['sass:dev','postcss:dev'],
        options: { livereload: true }
      },
      scripts:{
        files:[ 'source/scripts/**/*.js' ],
        tasks: ['uglify:dev', 'concat'],
        options: { livereload: true }
      },
      files: {
        files: [ 'source/images/**/*', 'source/fonts/**/*' ],
        tasks:['copy:dev','cwebp:dev'],
        options: { livereload: true }
      },
      static:{
        files:[ 'index.html' ],
        options: { livereload: true }
      }
    },

    sass: {
      dev: {
        options: {
          style: 'compact'
        },
        files: {
          'static/styles/main.min.css': 'source/styles/main.scss'
        }
      },
      dist: {
        options: {
          style: 'minified'
        },
        files: {
          'dist/static/styles/main.min.css': 'source/styles/main.scss'
        }
      },
    },

    postcss: {
      options: {
        processors: [
          require('pixrem')(),
          require('autoprefixer')({browsers: 'last 2 versions'}),
          require('cssnano')()
        ]
      },
      dev: {
        src: 'static/styles/main.min.css'
      },
      dist: {
        src: 'dist/static/styles/main.min.css'
      }
    },

    uglify: {
      dev: {
        options: {
          mangle:false,
          beautify:true,
        },
        files: {
          'static/scripts/main.min.js': ['source/scripts/main.js']
        }
      },
      dist: {
        options: {
          mangle:true,
          beautify:false,
        },
        files: {
          'dist/static/scripts/main.min.js': ['source/scripts/main.js']
        }
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['static/scripts/vendor/*.js', 'static/scripts/main.min.js'],
        dest: 'static/scripts/main.min.js',
      },
    },

    connect: {
      server: {
        options: {
          port: 8080,
          base: './'
        }
      }
    },

    clean: {
      dev: {
        src: ['static']
      },
      dist: {
        src: ['dist']
      }
    },

    cwebp: {
      dev: {
        options: {
          q: 80,
          sameExt: true
        },
        files: [{
          expand: true,
          cwd: 'source/images/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'static/images/'
        }]
      },
      dist: {
        options: {
          q: 80,
          sameExt: true
        },
        files: [{
          expand: true,
          cwd: 'source/images/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/static/images/'
        }]
      }
    },

    copy: {
      dev: {
        files: [
          {
            expand: true,
            cwd: 'source/scripts/vendor/',
            src: '**/*',
            dest: 'static/scripts/vendor/'
          },
          {
            expand: true,
            cwd: 'source/fonts/',
            src: '**/*',
            dest: 'static/fonts/'
          }
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'source/scripts/vendor/',
            src: '**/*',
            dest: 'dist/static/scripts/vendor/'
          },
          {
            expand: true,
            cwd: 'source/fonts/',
            src: '**/*',
            dest: 'dist/static/fonts/'
          },
          {
            expand: true,
            dot: true,
            cwd: './',
            dest: 'dist/',
            src: [
              'favicon.png',
              'index.html'
            ]
          }
        ]
      }
    },

    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5,
        title: 'Compilado',
        success: true,
        duration: 3
      }
    },

  });

  // Deps
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-cwebp');

  // Notifications
  grunt.task.run('notify_hooks');

  // Tasks
  grunt.registerTask('dev', ['clean:dev','copy:dev','cwebp:dev','sass:dev','postcss:dev','uglify:dev', 'concat','connect','watch']);
  grunt.registerTask('build', ['clean:dev','copy:dev','cwebp:dev','sass:dev','postcss:dev','uglify:dev', 'concat']);
  grunt.registerTask('deploy', ['clean:dist','copy:dist','cwebp:dist','sass:dist','postcss:dist','uglify:dist', 'concat']);

};
