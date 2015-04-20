module.exports = function(grunt) {

    grunt.initConfig({
        libRoot: 'static/lib',

        'bower-install-simple': {
            'prod': {
                options: {
                    production: true
                }
            },
            'dev': {
                options: {
                    production: false
                }
            }
        },
        concat: {
            require: {
                files: {
                    '<%= libRoot %>/require.js': ['bower_components/requirejs/require.js']
                }
            },
            domReady: {
                files: {
                    '<%= libRoot %>/domReady.js': ['bower_components/domReady/domReady.js']
                }
            },
            jquery: {
                files: {
                    '<%= libRoot %>/jquery.js': ['bower_components/jquery/dist/jquery.js']
                }
            },
            skeleton: {
                files: {
                    '<%= libRoot %>/skeleton.css': [
                        'bower_components/skeleton/css/normalize.css',
                        'bower_components/skeleton/css/skeleton.css'
                    ]
                }
            },
            less: {
                files: {
                    '<%= libRoot %>/less.js': ['bower_components/less/dist/less.js']
                }
            }
        },
        copy: {
            'jquery-ui': {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/jquery-ui/',
                        src: ['ui/**/*'],
                        dest: '<%= libRoot %>/jquery-ui/'
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/jquery-ui/',
                        src: ['themes/smoothness/**/*'],
                        dest: '<%= libRoot %>/jquery-ui/'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-bower-install-simple");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('dev', ['bower-install-simple:dev', 'copy', 'concat']);
    // TODO prod build
    grunt.registerTask('prod', ['bower-install-simple:prod']);
    grunt.registerTask('default', ['dev']);
};