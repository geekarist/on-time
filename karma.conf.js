// Karma configuration
// Generated on Wed May 29 2013 13:46:56 GMT+0200 (CEST)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/components/angular-1.0.7/angular.js',
  'app/components/angular-1.0.7/angular-*.js',
  'app/components/angular-ui-bootstrap-0.3.0/ui-bootstrap-tpls-0.3.0.js',
  'https://apis.google.com/js/client.js',
  'app/js/**/*.js',
  'test/**/*Spec.js',
  { pattern: 'node_modules/sinon/pkg/sinon.js', watched: false, included: true }
];


// list of files to exclude
exclude = [

];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];

// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Firefox'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
