/**
 * loads sub modules and wraps them up into the main module.
 * This should be used for top-level module definitions only.
 */
define([
  'angular',
  'ngResource',
  'ui.router',
  'angularjs-toaster',
  'ui.bootstrap',
  'ui.bootstrap-tpls',
  'angular-animate',
  'd3'
], function (angular) {
  'use strict';

  return angular.module('app', [
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'toaster'
  ]);

});
