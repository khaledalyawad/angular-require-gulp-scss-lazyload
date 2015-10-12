if (typeof define !== 'function') {
  // to be able to require file from node
  var define = require('amdefine')(module);
}

define({
  baseUrl: '/',               //paths relative to `source` folder

  paths: {
    'angular'                 : 'vendor/angular/angular',
    'angularjs-toaster'       : 'vendor/angularjs-toaster/toaster',
    'ngResource'              : 'vendor/angular-resource/angular-resource',
    'ui.router'               : 'vendor/angular-ui-router/release/angular-ui-router',
    'ui.bootstrap'            : 'vendor/angular-bootstrap/ui-bootstrap.min',
    'ui.bootstrap-tpls'       : 'vendor/angular-bootstrap/ui-bootstrap-tpls.min',
    'angular-animate'         : 'vendor/angular-animate/angular-animate',

    'lodash'                  : 'vendor/lodash/lodash',


    'async'                   : 'vendor/requirejs-plugins/src/async',
    'jquery'                  : 'vendor/jquery/dist/jquery',
    'd3'                      : 'vendor/d3/d3.min',

    /* App Setup */
    'app'                     : 'js/app',

    /* lazy load Services */
    'lazy-load-service'       : 'js/_global-resources/lazy-load/lazy-load.r',

    /* call Services */
    'api-call'                : 'js/_global-resources/api-services/api-call.r',
    'api-interceptor'         : 'js/_global-resources/api-services/api-interceptor.r',


  },

  shim: {
    'angular': {
      'deps': ['jquery'],
      'exports': 'angular'
    },
    'ngResource': ['angular'],
    'ui.router' : ['angular']
  }
});
