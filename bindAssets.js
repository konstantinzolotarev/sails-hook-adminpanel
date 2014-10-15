'use strict';

var _ = require('lodash');
var async = require('async');

/**
 * List of css file that should be injected into app
 *
 * @type {Array}
 */
var cssToInject = [
    'css/animate.css',
    'css/bootstrap.min.css'
];

/**
 * JS files that should be injected
 *
 * @type {Array}
 */
var jsToInject = [
    'js/dependencies/sails.io.js',
    'js/dependencies/jquery-2.1.1.min.js',
    'js/dependencies/bootstrap/bootstrap.js',
    'js/dependencies/angular/angular.js',
    'js/dependencies/angular/angular-animate.js',
    'js/dependencies/angular/angular-aria.js',
    'js/dependencies/angular/angular-messages.js',
    'js/dependencies/angular/angular-resource.js',
    'js/dependencies/angular/angular-sanitize.js',
    'js/dependencies/angular/angular-touch.js'
];

/**
 * Fonts that should be injected
 *
 * @type {Array}
 */
var fontsToInject = [
    'fonts/glyphicons-halflings-regular.eot',
    'fonts/glyphicons-halflings-regular.svg',
    'fonts/glyphicons-halflings-regular.ttf',
    'fonts/glyphicons-halflings-regular.woff'
];

module.exports = function(sails) {
    _.forEach(cssToInject, function(css) {

    });
};