module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      styles: {
        files: ['source/styles/**/*.scss'],
        tasks: ['sass:dev', 'postcss:dev'],
        options: { livereload: true },
      },
      scripts: {
        files: ['source/scripts/**/*.js'],
        tasks: ['concat:dev', 'uglify:dev'],
        options: { livereload: true },
      },
      files: {
        files: ['source/images/**/*', 'source/fonts/**/*'],
        tasks: ['copy:dev', 'imagemin:dev'],
        options: { livereload: true },
      },
      static: {
        files: ['*.html', '**/*.html', '*.php', '**/*.php'],
        options: { livereload: true },
      },
    },

    sass: {
      dev: {
        files: {
          'static/styles/main.min.css': 'source/styles/main.scss',
        },
      },
      dist: {
        files: {
          'dist/static/styles/main.min.css': 'source/styles/main.scss',
        },
      },
    },

    postcss: {
      options: {
        processors: [require('pixrem')(), require('autoprefixer')({ browsers: 'last 2 versions' }), require('cssnano')()],
      },
      dev: {
        src: 'static/styles/main.min.css',
      },
      dist: {
        src: 'dist/static/styles/main.min.css',
      },
    },

    uglify: {
      dev: {
        options: {
          mangle: false,
          beautify: true,
        },
        files: {
          'static/scripts/main.min.js': ['source/scripts/main.con.js'],
        },
      },
      dist: {
        options: {
          mangle: true,
          beautify: false,
        },
        files: {
          'dist/static/scripts/main.min.js': ['source/scripts/main.con.js'],
        },
      },
    },

    concat: {
      options: {
        separator: ';',
      },
      dev: {
        src: ['source/scripts/vendor/*.js', 'source/scripts/functions/*.js', 'source/scripts/main.js'],
        dest: 'source/scripts/main.con.js',
      },
      dist: {
        src: ['source/scripts/vendor/*.js', 'source/scripts/functions/*.js', 'source/scripts/main.js'],
        dest: 'source/scripts/main.con.js',
      },
    },

    connect: {
      server: {
        options: {
          port: 8080,
          base: './',
        },
      },
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        files: { 'dist/index.html': 'index.html' },
      },
    },

    clean: {
      dev: {
        src: ['static'],
      },
      dist: {
        src: ['dist'],
      },
    },

    imagemin: {
      dev: {
        options: {
          optimizationLevel: 3,
          svgoPlugins: [{ removeViewBox: false }, { removeUselessStrokeAndFill: true }, { removeEmptyAttrs: true }],
        },
        files: [
          {
            expand: true,
            cwd: 'source/images/',
            src: ['**/*.{png,jpg,gif,svg}'],
            dest: 'static/images/',
          },
        ],
      },
      dist: {
        options: {
          optimizationLevel: 5,
          svgoPlugins: [{ removeViewBox: false }, { removeUselessStrokeAndFill: true }, { removeEmptyAttrs: true }],
        },
        files: [
          {
            expand: true,
            cwd: 'source/images/',
            src: ['**/*.{png,jpg,gif,svg}'],
            dest: 'dist/static/images/',
          },
        ],
      },
    },

    copy: {
      dev: {
        files: [
          {
            expand: true,
            cwd: 'source/fonts/',
            src: '**/*',
            dest: 'static/fonts/',
          },
        ],
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: 'source/fonts/',
            src: '**/*',
            dest: 'dist/static/fonts/',
          },
          {
            expand: true,
            dot: true,
            cwd: './',
            dest: 'dist/',
            src: ['favicon.png', 'social.jpg', 'index.html'],
          },
        ],
      },
    },

    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5,
        title: 'Compilado',
        success: true,
        duration: 3,
      },
    },
  })

  // Deps
  grunt.loadNpmTasks('grunt-notify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-htmlmin')
  grunt.loadNpmTasks('grunt-postcss')
  grunt.loadNpmTasks('grunt-contrib-uglify-es')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-imagemin')

  // Notifications
  grunt.task.run('notify_hooks')

  // Tasks
  grunt.registerTask('dev', ['clean:dev', 'copy:dev', 'imagemin:dev', 'sass:dev', 'postcss:dev', 'concat:dev', 'uglify:dev', 'connect', 'watch'])
  grunt.registerTask('build', ['clean:dev', 'copy:dev', 'imagemin:dev', 'sass:dev', 'postcss:dev', 'concat:dev', 'uglify:dev'])
  grunt.registerTask('deploy', ['clean:dist', 'copy:dist', 'imagemin:dist', 'sass:dist', 'postcss:dist', 'concat:dist', 'uglify:dist', 'htmlmin:dist'])
}
