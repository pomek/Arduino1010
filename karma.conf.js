'use strict';

module.exports = (config) => {
    const configuration = {
        basePath: './',
        frameworks: [
            'jasmine',
            'jasmine-matchers'
        ],
        files: [
            'test/.tmp/**/*.spec.js'
        ],
        plugins: [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-jasmine-matchers'
        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['Chrome'],
        singleRun: true,
        autoWatch: false
    };

    config.set(configuration);
};
