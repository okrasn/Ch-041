module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            "./client/bower_components/jquery/dist/jquery.min.js",
            "./client/bower_components/jquery-validation/dist/jquery.validate.min.js",
            "./client/bower_components/jquery-validation/dist/additional-methods.min.js",
            "./client/bower_components/bootstrap/dist/js/bootstrap.min.js",

            "./client/bower_components/angular/angular.min.js",
            "./client/bower_components/angular-animate/angular-animate.min.js",
            "./client/bower_components/angular-aria/angular-aria.min.js",
            "./client/bower_components/angular-messages/angular-messages.min.js",

            "./client/bower_components/angular-material/angular-material.min.js",
            "./client/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",

            "./client/bower_components/angular-ui-router/release/angular-ui-router.min.js",
            "./client/bower_components/ng-file-upload/ng-file-upload.min.js",
            "./client/bower_components/ng-file-upload/ng-file-upload-shim.min.js",
            "./client/bower_components/angular-favicon/angular-favicon.min.js",
            "./client/bower_components/jpkleemans-angular-validate/dist/angular-validate.min.js",
            "./client/bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min.js",

            './client/bower_components/satellizer/dist/satellizer.js',
            './client/bower_components/angular-jwt/dist/angular-jwt.min.js',
            './client/bower_components/angular-toastr/dist/angular-toastr.js',
            './client/bower_components/angular-toastr/dist/angular-toastr.tpls.js',
            "./client/bower_components/angular-socialshare/dist/angular-socialshare.min.js",
            "./client/bower_components/angular-mocks/angular-mocks.js",

            "./client/js/app.min.js",
            "./client/js/controllers/auth.controller.js",
            "./client/js/services/auth.service.js",
//            "./client/js/services/dashboard.service.spec.js",
//            "./client/js/services/feeds.service.spec.js",
//            "./client/js/services/articles.service.spec.js"
            "./client/js/controllers/registerNewUser.spec.js"
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
			"./client/js/app.min.js" : ['coverage']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],
		coverageReporter: {
      		type : 'html',
      		dir : 'client/coverage'
    	},

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        browserify: {
            debug: true,
            transform: []
        },
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        plugins: [
            'karma-chrome-launcher',
    		'karma-jasmine', 
			'karma-spec-reporter', 
			'karma-coverage'
		],
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}