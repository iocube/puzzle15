module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			options: {
				livereload: true
			},
			js: {
				files: ['scripts/**/*.js'],
				tasks: ['jshint']
			},
			templates: {
				files: ['scripts/**/*.html']
			}
		},
		connect: {
			server: {
				options: {
					port: 8000,
					base: '',
					livereload: true,
					middleware: function(connect, options, middlewares) {
            var modRewrite = require('connect-modrewrite');

            // enable Angular's HTML5 mode
            middlewares.unshift(modRewrite(['!\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.jpeg$ /index.html [L]']));

            return middlewares;
          }
				}
			}
		},
		jshint: {
			scripts: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: ['scripts/**/*.js'],
			}
		},
	});

	// tasks
	grunt.registerTask('default', []);
	grunt.registerTask('serve', ['connect', 'watch']);

	// plugins
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
}
